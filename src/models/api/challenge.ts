import {TimeControl} from "./time_control";
import z from "zod";

export const ApiChallenge = z.object({
    uuid: z.string().uuid(),
    challengerKey: z.string().length(64),
    challengedKey: z.string().length(64),
    isChallengerWhite: z.boolean(),
    isChallengerBlack: z.boolean(),
    timeControl: TimeControl,
    botName: z.string(),
});

export type ApiChallenge = z.infer<typeof ApiChallenge>;

export function NewChallenge(
    uuid: string,
    challengerKey: string,
    challengedKey: string,
    isChallengerWhite: boolean,
    isChallengerBlack: boolean,
    timeControl: TimeControl,
    botName: string
): ApiChallenge {
    return {
        uuid,
        challengerKey,
        challengedKey,
        isChallengerWhite,
        isChallengerBlack,
        timeControl,
        botName,
    };
}

// interface ConstructorArgs {
//     uuid: string;
//     challengerKey: string;
//     challengedKey: string;
//     isChallengerWhite: boolean;
//     isChallengerBlack: boolean;
//     timeControl: TimeControl,
//     botName: string;
// }
//
// export class Challenge {
//     uuid: string;
//     challengerKey: string;
//     challengedKey: string;
//     isChallengerWhite: boolean;
//     isChallengerBlack: boolean;
//     timeControl: TimeControl;
//     botName: string;
//
//     constructor({
//                     uuid,
//                     challengerKey,
//                     challengedKey,
//                     isChallengerWhite,
//                     isChallengerBlack,
//                     timeControl,
//                     botName
//                 }: ConstructorArgs) {
//         this.uuid = uuid;
//         this.challengerKey = challengerKey;
//         this.challengedKey = challengedKey;
//         this.isChallengerWhite = isChallengerWhite;
//         this.isChallengerBlack = isChallengerBlack;
//         this.timeControl = timeControl;
//         this.botName = botName;
//     }
//
//     isColorsRandom(): boolean {
//         return this.isChallengerWhite === this.isChallengerBlack;
//     }
//
//     static template(): Object {
//         return {
//             uuid: "some-uuid-string",
//             challengerKey: "some-challenger-key",
//             challengedKey: "some-challenged-key",
//             isChallengerWhite: true,
//             isChallengerBlack: false,
//             timeControl: TimeControl.template(),
//             botName: ""
//         };
//     }
//
//     static fromJSON(): Challenge {
//
//     }
// }