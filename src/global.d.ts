import {ArbitratorClient} from "./services/arbitrator_client";
import {AuthManager} from "./services/auth_manager";

declare global {
    interface Window {
        services: {
            authManager: AuthManager;
            arbitratorClient: ArbitratorClient;
        }
    }
}