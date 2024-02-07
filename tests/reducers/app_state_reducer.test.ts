import {Page} from "../../src/models/domain/page";
import {AppState} from "../../src/models/domain/app_state";
import {Match} from "../../src/models/domain/match";
import {BoardState} from "../../src/models/domain/board_state";
import {Challenge, newBlitzTimeControl, newBulletTimeControl} from "../../src/models/domain/challenge";
import {appStateReducer} from "../../src/reducers/app_state_reducer";
import {UpdateMatchAction} from "../../src/models/actions/update_match_action";
import {UpdateChallengeAction} from "../../src/models/actions/update_challenge_action";

function getSomeChallenge(): Challenge {
    return new Challenge({
        uuid: "some-challenge-uuid",
        challengerKey: "some-client-key",
        challengedKey: "some-other-client-key",
        timeControl: newBulletTimeControl(),
        isChallengerWhite: true,
        isChallengerBlack: false,
        botName: "",
        timeCreated: new Date(),
    });
}

describe("app_state_reducer", () => {
    let appState: AppState;
    beforeEach(() => {
        appState = new AppState({
            page: Page.HOME,
            match: null,
            lastMove: null,
        });
    });

    describe("on UPDATE_MATCH", () => {
        let updateMatchAction: UpdateMatchAction;
        describe("when the match exists and is not terminal", () => {
            beforeEach(() => {
                updateMatchAction = new UpdateMatchAction(new Match({
                    uuid: "some-uuid",
                    board: BoardState.getInitBoardState(),
                    whiteClientKey: "some-client-key",
                    blackClientKey: "some-other-client-key",
                    whiteTimeRemainingSec: 10,
                    blackTimeRemainingSec: 10,
                    timeControl: newBulletTimeControl(),
                    botName: "",
                }));
            });
            it("updates the match", () => {
                const newAppState = appStateReducer(appState, updateMatchAction);
                expect(newAppState.match).toBe(updateMatchAction.payload.newMatch);
            });
            it("sets the page to BOARD", () => {
                const newAppState = appStateReducer(appState, updateMatchAction);
                expect(newAppState.page).toBe(Page.BOARD);
            });
        });
        describe("when the match does not exist", () => {
            beforeEach(() => {
                updateMatchAction = new UpdateMatchAction(null);
            });
            it("updates the match", () => {
                const newAppState = appStateReducer(appState, updateMatchAction);
                expect(newAppState.match).toBe(updateMatchAction.payload.newMatch);
            });
            it("does not set the page to BOARD", () => {
                const newAppState = appStateReducer(appState, updateMatchAction);
                expect(newAppState.page).toBe(Page.HOME);
            });
        });
    });

    describe("on UPDATE_CHALLENGE", () => {
        let updateChallengeAction: UpdateChallengeAction;
        describe("when the challenge is inbound", () => {
            describe("when the challenge already exists", () => {
                beforeEach(() => {
                    const oldChallenge = new Challenge(getSomeChallenge());
                    appState.inboundChallenges = [
                        oldChallenge,
                    ];

                    const challenge = new Challenge({
                        ...oldChallenge,
                        timeControl: newBlitzTimeControl(),
                    });
                    updateChallengeAction = new UpdateChallengeAction(true, challenge);
                });
                it("updates the challenge", () => {
                    const newAppState = appStateReducer(appState, updateChallengeAction);
                    expect(newAppState.inboundChallenges).toHaveLength(1);
                    expect(newAppState.inboundChallenges[0]).toBe(updateChallengeAction.payload.newChallenge);
                });
            });
            describe("when the challenge does not exist", () => {
                beforeEach(() => {
                    updateChallengeAction = new UpdateChallengeAction(true, getSomeChallenge());
                });

                it("adds an inbound challenge", () => {
                    const newAppState = appStateReducer(appState, updateChallengeAction);
                    expect(newAppState.inboundChallenges).toHaveLength(1);
                    expect(newAppState.inboundChallenges[0]).toBe(updateChallengeAction.payload.newChallenge);
                });
            });
        });
        describe("when the challenge is outbound", () => {
            describe("when the challenge already exists", () => {
                beforeEach(() => {
                    const oldChallenge = new Challenge(getSomeChallenge());
                    appState.inboundChallenges = [
                        oldChallenge,
                    ];

                    const challenge = new Challenge({
                        ...oldChallenge,
                        timeControl: newBlitzTimeControl(),
                    });
                    updateChallengeAction = new UpdateChallengeAction(false, challenge);
                });
                it("updates the challenge", () => {
                    const newAppState = appStateReducer(appState, updateChallengeAction);
                    expect(newAppState.outboundChallenges).toHaveLength(1);
                    expect(newAppState.outboundChallenges[0]).toBe(updateChallengeAction.payload.newChallenge);
                });
            });
            describe("when the challenge does not exist", () => {
                beforeEach(() => {
                    updateChallengeAction = new UpdateChallengeAction(false, getSomeChallenge());
                });

                it("adds an outbound challenge", () => {
                    const newAppState = appStateReducer(appState, updateChallengeAction);
                    expect(newAppState.outboundChallenges).toHaveLength(1);
                    expect(newAppState.outboundChallenges[0]).toBe(updateChallengeAction.payload.newChallenge);
                });
            });
        });
    });
});