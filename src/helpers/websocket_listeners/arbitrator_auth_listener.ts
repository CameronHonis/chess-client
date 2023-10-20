import {MessageListener} from "./message_listener";
import {Throwable} from "../../types";
import {ArbitratorAuthMessage} from "../../models/messages/arbitrator_auth_message";
import {AuthDomain} from "../../models/enums/auth_domain";

export class ArbitratorAuthListener implements MessageListener {
    static receiveMessage(e: MessageEvent): Throwable<void> {
        const authMessage = ArbitratorAuthMessage.fromJSON(JSON.parse(e.data));
        window.services.authManager.setKeysetOnDomain(AuthDomain.ARBITRATOR, authMessage.toKeyset())
    }
}