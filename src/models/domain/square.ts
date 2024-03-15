import {ApiSquare} from "../api/square";

export type SquareHash = string;

export class Square {
    rank: number
    file: number

    constructor(rank: number, file: number) {
        this.rank = rank;
        this.file = file;
    }

    isDarkSquare(): boolean {
        if (this.rank % 2 === 0) {
            return this.file % 2 === 0;
        } else {
            return this.file % 2 === 1;
        }
    }


    isOutsideBoard(): boolean {
        return this.rank < 1 || this.rank > 8 || this.file < 1 || this.file > 8;
    }

    distanceFrom(other: Square): number {
        return Math.max(Math.abs(this.rank - other.rank), Math.abs(this.file - other.file));
    }

    hash(): SquareHash {
        return `${this.rank.toString()}-${this.file.toString()}`;
    }

    equalTo(otherSquare: Square): boolean {
        return this.rank === otherSquare.rank && this.file === otherSquare.file;
    }

    toAlgebraicCoords(): string {
        const fileSymbols = ["a", "b", "c", "d", "e", "f", "g", "h"];
        return `${fileSymbols[this.file - 1]}${this.rank}`;
    }

    static fromAlgebraicCoords(coords: string): Square {
        // e3
        const fileBySymbol: { [key: string]: number } = {a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8};
        return new Square(Number.parseInt(coords.charAt(1)), fileBySymbol[coords.charAt(0)]);
    }

    copyWith({rank, file}: Partial<Square>): Square {
        return new Square(rank || this.rank, file || this.file);
    }

    copy(): Square {
        return this.copyWith({});
    }

    static fromApi(apiSquare: ApiSquare): Square {
        return new Square(apiSquare.rank, apiSquare.file);
    }

    static fromHash(hash: SquareHash): Square {
        if (hash.length !== 3)
            throw new Error(`cannot extract square from hash: ${hash}`);
        const rank = parseInt(hash.charAt(0));
        const file = parseInt(hash.charAt(2));
        if (Number.isNaN(rank) || Number.isNaN(file)) {
            throw new Error(`cannot extract square from hash: ${hash}`);
        }
        return new Square(rank, file);
    }
}