import {ArbitratorClient} from "./services/arbitrator_client";

declare global {
    interface Window {
        services: {
            arbitratorClient: ArbitratorClient;
        }
    }
}