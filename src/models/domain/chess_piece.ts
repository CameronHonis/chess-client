export enum ChessPiece {
    EMPTY,
    WHITE_PAWN,
    WHITE_KNIGHT,
    WHITE_BISHOP,
    WHITE_ROOK,
    WHITE_QUEEN,
    WHITE_KING,
    BLACK_PAWN,
    BLACK_KNIGHT,
    BLACK_BISHOP,
    BLACK_ROOK,
    BLACK_QUEEN,
    BLACK_KING
}

export function ChessPieceFromApi(apiPiece: number): ChessPiece {
    return apiPiece as ChessPiece;
}