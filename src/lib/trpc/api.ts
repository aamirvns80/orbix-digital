import "server-only";

import { createCallerFactory, createTRPCContext } from "./server";
import { appRouter } from "./root";
import { cache } from "react";

const createCaller = createCallerFactory(appRouter);

export const api = createCaller(async () => {
    const context = await createTRPCContext();
    return {
        ...context,
        // Add any other context overrides if needed
    };
});
