import {MessageContentType} from "../../../src/models/api/messages/message_content_type";
import {ArbitratorMessage} from "../../../src/models/api/messages/arbitrator_message";


describe("parseMessageFromJson", () => {
    it("parses a MatchUpdatedMessage", () => {
        const matchUpdatedMsgJson = {
            "senderKey": "",
            "privateKey": "",
            "topic": "match-76b417df-35e1-40e4-9234-70e453d7fdfc",
            "contentType": "MATCH_UPDATED",
            "content": {
                "match": {
                    "uuid": "76b417df-35e1-40e4-9234-70e453d7fdfc",
                    "board": {
                        "pieces": [[4, 2, 3, 5, 6, 3, 2, 4], [1, 1, 1, 1, 1, 1, 1, 1], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0], [7, 7, 7, 7, 7, 7, 7, 7], [10, 8, 9, 11, 12, 9, 8, 10]],
                        "enPassantSquare": null,
                        "isWhiteTurn": true,
                        "canWhiteCastleQueenside": true,
                        "canWhiteCastleKingside": true,
                        "canBlackCastleQueenside": true,
                        "canBlackCastleKingside": true,
                        "halfMoveClockCount": 0,
                        "fullMoveCount": 1,
                        "repetitionsByMiniFEN": {"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -": 1},
                        "isTerminal": false,
                        "isWhiteWinner": false,
                        "isBlackWinner": false
                    },
                    "whiteClientKey": "b0d7dfd5f91ce83b7baae3c17e05aa05729b143d30768abc89c74c8762b59ce4",
                    "whiteTimeRemainingSec": 300,
                    "blackClientKey": "948669118cf13b879a9f63da87c8392d77ba22383f7e61feb8e94ee0ee5c2ef2",
                    "blackTimeRemainingSec": 300,
                    "timeControl": {
                        "initialTimeSec": 300,
                        "incrementSec": 0,
                        "timeAfterMovesCount": 0,
                        "secAfterMoves": 0
                    },
                    "botName": ""
                }
            }
        };
        //@ts-ignore
        const parsedMsg = ArbitratorMessage.fromJson(matchUpdatedMsgJson) as ArbitratorMessage<MessageContentType.MATCH_UPDATED>;
        expect(parsedMsg).toBeInstanceOf(ArbitratorMessage);
        expect(parsedMsg.topic ).toBe("match-76b417df-35e1-40e4-9234-70e453d7fdfc");
        expect(parsedMsg.contentType).toBe(MessageContentType.MATCH_UPDATED);
        expect(parsedMsg.content).not.toBe(null);
        expect(parsedMsg.content.match).not.toBe(null);
        expect(parsedMsg.content.match!.uuid).toBe("76b417df-35e1-40e4-9234-70e453d7fdfc");
        expect(parsedMsg.content.match!.whiteClientKey).toBe("b0d7dfd5f91ce83b7baae3c17e05aa05729b143d30768abc89c74c8762b59ce4");
        expect(parsedMsg.content.match!.whiteTimeRemainingSec).toBe(300);
        expect(parsedMsg.content.match!.blackClientKey).toBe("948669118cf13b879a9f63da87c8392d77ba22383f7e61feb8e94ee0ee5c2ef2");
        expect(parsedMsg.content.match!.blackTimeRemainingSec).toBe(300);
        expect(parsedMsg.content.match!.board).not.toBe(null);
        expect(parsedMsg.content.match!.timeControl).not.toBe(null);
    });
});