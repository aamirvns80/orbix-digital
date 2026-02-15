import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { leads, leadActivities } from "@/db/schema";

// Transform empty strings to undefined so optional validators work correctly
const emptyToUndefined = z.literal("").transform(() => undefined);

const captureSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    firstName: z.string().max(100).optional().or(emptyToUndefined),
    lastName: z.string().max(100).optional().or(emptyToUndefined),
    company: z.string().max(200).optional().or(emptyToUndefined),
    phone: z.string().max(50).optional().or(emptyToUndefined),
    website: z.string().max(500).optional().or(emptyToUndefined),
    serviceInterest: z.array(z.string()).optional(),
    budget: z.string().optional().or(emptyToUndefined),
    timeline: z.string().optional().or(emptyToUndefined),
    source: z.string().default("website"),
    utmSource: z.string().optional().or(emptyToUndefined),
    utmMedium: z.string().optional().or(emptyToUndefined),
    utmCampaign: z.string().optional().or(emptyToUndefined),
    utmTerm: z.string().optional().or(emptyToUndefined),
    utmContent: z.string().optional().or(emptyToUndefined),
    message: z.string().max(5000).optional().or(emptyToUndefined),
    selectedPlan: z.string().optional().or(emptyToUndefined),
});

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parsed = captureSchema.safeParse(body);

        if (!parsed.success) {
            const fieldErrors = parsed.error.flatten().fieldErrors;
            const errorMessages = Object.entries(fieldErrors)
                .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(", ")}`)
                .join("; ");
            return NextResponse.json(
                { error: errorMessages || "Invalid input", details: parsed.error.flatten() },
                { status: 400, headers: corsHeaders }
            );
        }

        const data = parsed.data;

        // Check for existing lead by email
        const [existing] = await db
            .select({ id: leads.id, score: leads.score })
            .from(leads)
            .where(eq(leads.email, data.email))
            .limit(1);

        if (existing) {
            // Update existing lead with new data (merge, don't overwrite)
            const updateData: Record<string, unknown> = { updatedAt: new Date() };
            if (data.firstName) updateData.firstName = data.firstName;
            if (data.lastName) updateData.lastName = data.lastName;
            if (data.company) updateData.company = data.company;
            if (data.phone) updateData.phone = data.phone;
            if (data.serviceInterest) updateData.serviceInterest = data.serviceInterest;
            if (data.budget) updateData.budget = data.budget;
            if (data.timeline) updateData.timeline = data.timeline;
            // Bump score for returning interest
            updateData.score = existing.score + 5;

            await db
                .update(leads)
                .set(updateData)
                .where(eq(leads.id, existing.id));

            // Log re-engagement
            await db.insert(leadActivities).values({
                type: "form_submit",
                description: "Lead re-submitted capture form",
                metadata: {
                    source: data.source,
                    utmSource: data.utmSource,
                    message: data.message,
                },
                leadId: existing.id,
            });

            return NextResponse.json(
                { success: true, message: "Thank you! We'll be in touch." },
                { status: 200, headers: corsHeaders }
            );
        }

        // Create new lead
        const [created] = await db
            .insert(leads)
            .values({
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                company: data.company,
                phone: data.phone,
                website: data.website,
                serviceInterest: data.serviceInterest ?? [],
                budget: data.budget,
                timeline: data.timeline,
                source: data.source,
                utmSource: data.utmSource,
                utmMedium: data.utmMedium,
                utmCampaign: data.utmCampaign,
                utmTerm: data.utmTerm,
                utmContent: data.utmContent,
                status: "new",
                score: 10,
            })
            .returning({ id: leads.id });

        // Log initial activity
        await db.insert(leadActivities).values({
            type: "form_submit",
            description: "Lead captured from website form",
            metadata: {
                source: data.source,
                utmSource: data.utmSource,
                utmCampaign: data.utmCampaign,
                message: data.message,
            },
            leadId: created.id,
        });

        return NextResponse.json(
            { success: true, message: "Thank you! We'll be in touch shortly." },
            { status: 201, headers: corsHeaders }
        );
    } catch (error) {
        console.error("Lead capture error:", error);
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500, headers: corsHeaders }
        );
    }
}
