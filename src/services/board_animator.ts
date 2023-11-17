import {Square} from "../models/square";
import {Throwable} from "../types";

export class BoardAnimator {
    private pieceMoveAnimation: PieceMoveAnimation | null = null;
    private pieceMoveDurationMs: number = 3000;
    private holdPieceAnimation: HoldPieceAnimation | null = false;

    constructor() {
        const clock = () => {
            this.onTick();

            window.requestAnimationFrame(() => clock());
        }
        window.requestAnimationFrame(() => clock());
    }

    movePiece(startSquare: Square, destSquare: Square) {
        if (this.pieceMoveAnimation) {
            this.pieceMoveAnimation.cleanUp();
        }
        this.pieceMoveAnimation = new PieceMoveAnimation(startSquare, destSquare);
    }

    testMovePiece() {
        this.movePiece(new Square(1, 1), new Square(8, 8));
    }

    holdPiece(square: Square) {

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
    }
}

export class PieceMoveAnimation {
    private originTile: HTMLDivElement;
    private originSquare: Square;
    private destinationTile: HTMLDivElement;
    private destinationSquare: Square;
    private animatedTile: HTMLDivElement;
    readonly startTimeMs: number;

    constructor(startSquare: Square, destSquare: Square) {
        const originTileId = `Tile${startSquare.getHash()}`;
        this.originTile = document.getElementById(originTileId) as HTMLDivElement;
        this.originSquare = startSquare;

        const destTileId = `Tile${destSquare.getHash()}`;
        this.destinationTile = document.getElementById(destTileId) as HTMLDivElement;
        this.destinationSquare = destSquare;
        this.startTimeMs = performance.now();

        this.animatedTile = this.destinationTile.cloneNode(true) as HTMLDivElement;
        this.originTile.parentNode!.appendChild(this.animatedTile);
        const {height, width, left, top} = this.originTile.getBoundingClientRect();
        this.animatedTile.style.position = "absolute";
        this.animatedTile.style.zIndex = "2";
        this.animatedTile.style.width = `${width}px`;
        this.animatedTile.style.height = `${height}px`;
        this.animatedTile.style.left = `${left}px`;
        this.animatedTile.style.top = `${top}px`;
        this.animatedTile.style.background = "none";

    }

    onTick(progress: number) {
        try {
            this.setTilePieceVisible(this.originSquare, false);
        } catch(err) {}
        try {
            this.setTilePieceVisible(this.destinationSquare, false);
        } catch(err) {}

        const {x: originX, y: originY} = this.originTile.getBoundingClientRect();
        const {x: destX, y: destY} = this.destinationTile.getBoundingClientRect();
        const deltaX = destX - originX;
        const deltaY = destY - originY;
        this.animatedTile.style.left = `${originX + deltaX * progress}px`;
        this.animatedTile.style.top = `${originY + deltaY * progress}px`;
    }

    cleanUp() {
        this.animatedTile.remove();
        try {
            this.setTilePieceVisible(this.originSquare, true);
        } catch (err) {}
        try {
            this.setTilePieceVisible(this.destinationSquare, true);
        } catch (err) {}
    }

    private setTilePieceVisible(square: Square, isVisible: boolean): Throwable<void> {
        const tileId = `Tile${square.getHash()}`;
        console.log(`Setting tile ${tileId} visibility to ${isVisible}...`);
        const tilePiece = document.querySelector(`#${tileId} .TilePiece`) as SVGElement | null;
        if (!tilePiece) {
            throw new Error(`Tile ${tileId} not found`);
        }
        tilePiece.style.visibility = isVisible ? "visible" : "hidden";
        console.log(`Set tile ${tileId} visibility to ${isVisible}`)
    }
}

export class HoldPieceAnimation {

}