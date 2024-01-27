import {Square} from "../models/game/square";

export class BoardAnimator {
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

    movePiece(startSquare: Square, destSquare: Square) {
        if (this.pieceMoveAnimation) {
            this.pieceMoveAnimation.cleanUp();
        }
        this.pieceMoveAnimation = new PieceMoveAnimation(startSquare, destSquare);
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
    private originSquare: Square;
    private destSquare: Square;
    private originTile: HTMLDivElement;
    private destTile: HTMLDivElement;
    private startX: number;
    private startY: number;
    private endX: number;
    private endY: number;
    readonly startTimeMs: number;

    constructor(startSquare: Square, destSquare: Square) {
        this.originSquare = startSquare;
        this.destSquare = destSquare;

        const originTileId = `Tile${startSquare.getHash()}`;
        this.originTile = document.getElementById(originTileId) as HTMLDivElement;
        const {x: startX, y: startY} = this.originTile.getBoundingClientRect();
        this.startX = startX;
        this.startY = startY;

        const destTileId = `Tile${destSquare.getHash()}`;
        this.destTile = document.getElementById(destTileId) as HTMLDivElement;
        const {x: endX, y: endY} = this.destTile.getBoundingClientRect();
        this.endX = endX;
        this.endY = endY;

        this.startTimeMs = performance.now();
    }

    onTick(progress: number) {
        const animTile = document.getElementById("AnimatedTile");
        if (!animTile) { return }

        this.setTilePieceVisible(this.originSquare, false);
        this.setTilePieceVisible(this.destSquare, false);

        const { width, height } = this.originTile.getBoundingClientRect();
        const deltaX = this.endX - this.startX;
        const deltaY = this.endY - this.startY;

        animTile.style.left = `${this.startX + progress * deltaX}px`;
        animTile.style.top = `${this.startY + progress * deltaY}px`;
        animTile.style.width = `${width}px`;
        animTile.style.height = `${height}px`;
        animTile.style.visibility = "visible";
    }

    cleanUp() {
        this.setTilePieceVisible(this.originSquare, true);
        this.setTilePieceVisible(this.destSquare, true);
        const animTile = document.getElementById("AnimatedTile");
        if (!animTile) { return }
        animTile.style.visibility = "hidden";
    }

    private setTilePieceVisible(square: Square, isVisible: boolean) {
        const tileId = `Tile${square.getHash()}`;
        const tilePiece = document.querySelector(`#${tileId} .TilePiece`) as SVGElement | null;
        if (tilePiece) {
            tilePiece.style.visibility = isVisible ? "visible" : "hidden";
        }
    }
}

export class HoldPieceAnimation {
    draggingSquare: Square;
    draggingTile: HTMLDivElement;
    mouseX: number = -10000;
    mouseY: number = -10000;
    constructor(draggingSquare: Square) {
        this.draggingSquare = draggingSquare;
        const draggingTileId = `Tile${draggingSquare.getHash()}`;
        this.draggingTile = document.getElementById(draggingTileId) as HTMLDivElement;
        document.addEventListener("mousemove", e => this.setMousePos(e.clientX, e.clientY));
    }

    private setMousePos(x: number, y: number) {
        this.mouseX = x;
        this.mouseY = y;
    }

    onTick() {
        const animTile = document.getElementById("DraggingTile");
        if (!animTile) { return }

        const { width } = this.draggingTile.getBoundingClientRect();
        animTile.style.width = `${width}px`;
        animTile.style.top = `${width}px`;
        animTile.style.left = `${this.mouseX - width/2}px`;
        animTile.style.top = `${this.mouseY - width/2}px`;
    }

    cleanUp() {

    }
}