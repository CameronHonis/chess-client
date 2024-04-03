import {Square} from "../models/domain/square";
import {MouseButton} from "../types";
import {Move} from "../models/domain/move";

export class BoardAnimator {
    private lastMoveAnimated: Move | null = null;
    private pieceMoveAnimation: PieceMoveAnimation | null = null;
    private pieceMoveDurationMs: number = 500;
    private holdPieceAnimation: HoldPieceAnimation | null = null;

    constructor() {
        const clock = () => {
            this.onTick();

            window.requestAnimationFrame(() => clock());
        }
        window.requestAnimationFrame(() => clock());
    }

    private onTick() {
        if (this.pieceMoveAnimation) {
            const relT = performance.now() - this.pieceMoveAnimation.startTimeMs;
            const normT = relT / this.pieceMoveDurationMs;
            const progress = Math.sqrt(1 - Math.pow(normT - 1, 2));
            if (normT >= 1) {
                this.pieceMoveAnimation.cleanUp();
                this.pieceMoveAnimation = null;
            } else {
                this.pieceMoveAnimation.onTick(progress);
            }
        }
        if (this.holdPieceAnimation) {
            this.holdPieceAnimation.onTick();
        }
    }

    movePiece(move: Move) {
        if (this.pieceMoveAnimation) {
            this.pieceMoveAnimation.cleanUp();
        }

        if (this.lastMoveAnimated?.equalTo(move))
            return;

        this.lastMoveAnimated = move;
        this.pieceMoveAnimation = new PieceMoveAnimation(move.startSquare, move.endSquare);
    }

    holdPiece(square: Square) {
        if (this.holdPieceAnimation) {
            this.holdPieceAnimation.cleanUp();
        }
        this.holdPieceAnimation = new HoldPieceAnimation(square);
    }

    dropPiece() {
        if (this.holdPieceAnimation) {
            this.holdPieceAnimation.cleanUp();
        }
        this.holdPieceAnimation = null;
    }
}

export class PieceMoveAnimation {
    private readonly originSquare: Square;
    private readonly destSquare: Square;
    readonly startTimeMs: number;
    // memoized
    private originTile: HTMLDivElement | undefined;
    private destTile: HTMLDivElement | undefined;
    private _destTilePiece: HTMLImageElement | undefined;
    private startX: number | undefined;
    private startY: number | undefined;
    private endX: number | undefined;
    private endY: number | undefined;
    private tileWidth: number | undefined;
    private tileHeight: number | undefined;

    constructor(startSquare: Square, destSquare: Square) {
        this.originSquare = startSquare;
        this.destSquare = destSquare;
        this.startTimeMs = performance.now();
    }

    onTick(progress: number) {
        const animTile = document.getElementById("MoveTile");
        if (!animTile)
            return;
        const animStartCoords = this.startCoords();
        if (!animStartCoords)
            return;
        const animEndCoords = this.endCoords();
        if (!animEndCoords)
            return;
        const tileSize = this.tileSize();
        if (!tileSize)
            return;
        const [startX, startY] = animStartCoords;
        const [endX, endY] = animEndCoords;
        const [width, height] = tileSize;

        this.setDestTilePieceVisible(false);

        const deltaX = endX - startX;
        const deltaY = endY - startY;

        animTile.style.left = `${startX + progress * deltaX}px`;
        animTile.style.top = `${startY + progress * deltaY}px`;
        animTile.style.width = `${width}px`;
        animTile.style.height = `${height}px`;
        animTile.style.visibility = "visible";
    }

    cleanUp() {
        this.setDestTilePieceVisible(true);
        const animTile = document.getElementById("MoveTile");
        if (!animTile) {
            return
        }
        animTile.style.visibility = "hidden";
    }

    private startCoords(): [number, number] | null {
        if (!this.startX || !this.startY) {
            const boardSquareTiles = this.boardSquareTiles();
            if (!boardSquareTiles)
                return null;
            const [startTile] = boardSquareTiles;

            const {x, y} = startTile.getBoundingClientRect();
            this.startX = x;
            this.startY = y;
        }
        return [this.startX, this.startY];
    }

    private endCoords(): [number, number] | null {
        if (!this.endX || !this.endY) {
            const boardSquareTiles = this.boardSquareTiles();
            if (!boardSquareTiles)
                return null;
            const endTile = boardSquareTiles[1];

            const {x, y} = endTile.getBoundingClientRect();
            this.endX = x;
            this.endY = y;
        }
        return [this.endX, this.endY];
    }

    private tileSize(): [number, number] | null {
        if (!this.tileWidth || !this.tileHeight) {
            const boardSquareTiles = this.boardSquareTiles();
            if (!boardSquareTiles)
                return null;
            const [startTile] = boardSquareTiles;
            const {width, height} = startTile.getBoundingClientRect();
            this.tileWidth = width;
            this.tileHeight = height;
        }
        return [this.tileWidth, this.tileHeight];
    }

    private boardSquareTiles(): [HTMLDivElement, HTMLDivElement] | null {
        if (!this.originTile || !this.destTile) {
            const originTileId = `Tile${this.originSquare.hash()}`;
            this.originTile = document.getElementById(originTileId) as HTMLDivElement;
            const destTileId = `Tile${this.destSquare.hash()}`;
            this.destTile = document.getElementById(destTileId) as HTMLDivElement;
        }
        if (!this.originTile || !this.destTile)
            return null;
        return [this.originTile, this.destTile];
    }

    private destTilePiece(): HTMLImageElement | undefined {
        const tiles = this.boardSquareTiles();
        if (!tiles)
            return;
        const destTile = tiles[1];
        this._destTilePiece = destTile.querySelector("img") || undefined;
        return this._destTilePiece;
    }

    private setDestTilePieceVisible(isVisible: boolean) {
        const destTile = this.destTilePiece();
        if (!destTile)
            return;

        destTile.style.visibility = isVisible ? "visible" : "hidden";
    }
}

export class HoldPieceAnimation {
    draggingSquare: Square;
    draggingTile: HTMLDivElement;
    isDragging: boolean;
    mouseX: number = -10000;
    mouseY: number = -10000;

    constructor(draggingSquare: Square) {
        this.isDragging = false;
        this.draggingSquare = draggingSquare;
        const draggingTileId = `Tile${draggingSquare.hash()}`;
        this.draggingTile = document.getElementById(draggingTileId) as HTMLDivElement;
        window.addEventListener("mousemove", ev => this.onMouseMove(ev));
        window.addEventListener("touchmove", ev => this.onTouchMove(ev));
    }

    private onTouchMove(ev: TouchEvent) {
        if (ev.touches.length !== 1) {
            return;
        }
        const touch = ev.touches[0];
        this.mouseX = touch.clientX;
        this.mouseY = touch.clientY;
        this.isDragging = true;
    }

    private onMouseMove(ev: MouseEvent) {
        this.mouseX = ev.clientX;
        this.mouseY = ev.clientY;
        this.isDragging = ev.button === MouseButton.LEFT;
    }

    onTick() {
        const animTile = document.getElementById("DraggingTile");
        if (!animTile) {
            return
        }

        const {width} = this.draggingTile.getBoundingClientRect();
        animTile.style.width = `${width}px`;
        animTile.style.height = `${width}px`;
        animTile.style.left = `${this.mouseX - width / 2}px`;
        animTile.style.top = `${this.mouseY - width / 2}px`;
    }

    cleanUp() {
        window.removeEventListener("mousemove", ev => this.onMouseMove(ev));
        window.removeEventListener("touchmove", ev => this.onTouchMove(ev));
    }
}