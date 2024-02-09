import {Throwable} from "../../types";

export enum MatchResult {
    IN_PROGRESS = "in_progress",
    WHITE_WINS_BY_CHECKMATE = "white_wins_by_checkmate",
    BLACK_WINS_BY_CHECKMATE = "black_wins_by_checkmate",
    WHITE_WINS_BY_RESIGNATION = "white_wins_by_resignation",
    BLACK_WINS_BY_RESIGNATION = "black_wins_by_resignation",
    WHITE_WINS_BY_TIMEOUT = "white_wins_by_timeout",
    BLACK_WINS_BY_TIMEOUT = "black_wins_by_timeout",
    DRAW_BY_STALEMATE = "draw_by_stalemate",
    DRAW_BY_INSUFFICIENT_MATERIAL = "draw_by_insufficient_material",
    DRAW_BY_THREEFOLD_REPETITION = "draw_by_threefold_repetition",
    DRAW_BY_FIFTY_MOVE_RULE = "draw_by_fifty_move_rule",
}

export function matchResultFromApi(matchResult: string): Throwable<MatchResult> {
    switch (matchResult) {
        case "in_progress": return MatchResult.IN_PROGRESS;
        case "white_wins_by_checkmate": return MatchResult.WHITE_WINS_BY_CHECKMATE;
        case "black_wins_by_checkmate": return MatchResult.BLACK_WINS_BY_CHECKMATE;
        case "white_wins_by_resignation": return MatchResult.WHITE_WINS_BY_RESIGNATION;
        case "black_wins_by_resignation": return MatchResult.BLACK_WINS_BY_RESIGNATION;
        case "white_wins_by_timeout": return MatchResult.WHITE_WINS_BY_TIMEOUT;
        case "black_wins_by_timeout": return MatchResult.BLACK_WINS_BY_TIMEOUT;
        case "draw_by_stalemate": return MatchResult.DRAW_BY_STALEMATE;
        case "draw_by_insufficient_material": return MatchResult.DRAW_BY_INSUFFICIENT_MATERIAL;
        case "draw_by_threefold_repetition": return MatchResult.DRAW_BY_THREEFOLD_REPETITION;
        case "draw_by_fifty_move_rule": return MatchResult.DRAW_BY_FIFTY_MOVE_RULE;
        default: throw new Error(`invalid match result: ${matchResult}`);
    }
}