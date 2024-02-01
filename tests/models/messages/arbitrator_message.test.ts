import {MessageContentType} from "../../../src/models/messages/message_content_type";
import {MatchUpdateMessageContent} from "../../../src/models/messages/arbitrator_contents/match_update_message_content";
import {ArbitratorMessage, parseMessageFromJson} from "../../../src/models/messages/arbitrator_message";
import {ApiMatch} from "../../../src/models/api/match";
import {BoardState} from "../../../src/models/domain/board_state";
import {ApiTimeControl} from "../../../src/models/api/time_control";


describe("parseMessageFromJson", () => {
    it("parses a MatchUpdatedMessage", () => {
        const matchUpdatedMsgJson = {
            topic: "match-matchId",
            contentType: MessageContentType.MATCH_UPDATED,
            content: MatchUpdateMessageContent.template(),
            senderKey: "",
            privateKey: "",
        } as { contentType: MessageContentType.MATCH_UPDATED };
        const parsedMsg = parseMessageFromJson(matchUpdatedMsgJson);
        expect(parsedMsg).toBeInstanceOf(ArbitratorMessage);
        expect(parsedMsg.topic).toBe("match-matchId");
        expect(parsedMsg.contentType).toBe(MessageContentType.MATCH_UPDATED);
        expect(parsedMsg.content).toBeInstanceOf(MatchUpdateMessageContent);
        expect(parsedMsg.content.match).toBeInstanceOf(ApiMatch);
        const expMatch = new ApiMatch(ApiMatch.template() as ApiMatch);
        expect(parsedMsg.content.match.uuid).toBe(expMatch.uuid);
        expect(parsedMsg.content.match.whiteClientId).toBe(expMatch.whiteClientId);
        expect(parsedMsg.content.match.whiteTimeRemaining).toBe(expMatch.whiteTimeRemaining);
        expect(parsedMsg.content.match.blackClientId).toBe(expMatch.blackClientId);
        expect(parsedMsg.content.match.blackTimeRemaining).toBe(expMatch.blackTimeRemaining);
        expect(parsedMsg.content.match.board).toBeInstanceOf(BoardState);
        expect(parsedMsg.content.match.timeControl).toBeInstanceOf(ApiTimeControl);
    });
});