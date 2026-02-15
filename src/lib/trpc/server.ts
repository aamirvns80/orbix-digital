import { initTRPC, TRPCError } from "@trpc/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import superjson from "superjson";
import { ZodError } from "zod";

export const createTRPCContext = async () => {
    const session = await auth();
    return {
        db,
        session,
        user: session?.user,
    };
};

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<TRPCContext>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.cause instanceof ZodError ? error.cause.flatten() : null,
            },
        };
    },
});

export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;

// Rate limiting map (in-memory, per-process)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const rateLimit = t.middleware(async ({ ctx, next }) => {
    const key = ctx.user?.id ?? "anonymous";
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 100;

    const entry = rateLimitMap.get(key);
    if (entry && now < entry.resetTime) {
        if (entry.count >= maxRequests) {
            throw new TRPCError({
                code: "TOO_MANY_REQUESTS",
                message: "Rate limit exceeded. Please try again later.",
            });
        }
        entry.count++;
    } else {
        rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    }

    return next();
});

// Public procedure (rate limited)
export const publicProcedure = t.procedure.use(rateLimit);

// Protected procedure (requires auth)
export const protectedProcedure = t.procedure
    .use(rateLimit)
    .use(async ({ ctx, next }) => {
        if (!ctx.session || !ctx.user) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You must be logged in to perform this action.",
            });
        }
        return next({
            ctx: {
                ...ctx,
                session: ctx.session,
                user: ctx.user,
            },
        });
    });

// Admin procedure (requires admin role)
export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
    if ((ctx.user as any)?.role !== "admin") {
        throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have permission to perform this action.",
        });
    }
    return next();
});
