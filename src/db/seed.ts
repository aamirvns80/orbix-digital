import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { db } from "./index";
import { users, companies, leads, leadActivities, leadNotes, tags, leadsToTags, testimonials, deliverables, tickets } from "./schema";
import bcrypt from "bcryptjs";

async function seed() {
    console.log("🌱 Seeding database...");

    // Clear existing data
    await db.delete(leadActivities);
    await db.delete(leadNotes);
    await db.delete(leadsToTags);
    await db.delete(tickets);
    await db.delete(deliverables);
    await db.delete(leads);
    await db.delete(users);
    await db.delete(companies);
    await db.delete(tags);
    await db.delete(testimonials);
    console.log("🧹 Database cleared");

    // --- Users ---
    const passwordHash = await bcrypt.hash("password123", 12);

    const [admin] = await db
        .insert(users)
        .values({
            name: "Admin User",
            email: "admin@OrbixDigital.com",
            passwordHash,
            role: "admin",
            emailVerified: new Date(),
        })
        .returning();

    const [teamMember] = await db
        .insert(users)
        .values({
            name: "Sarah Miller",
            email: "sarah@OrbixDigital.com",
            passwordHash,
            role: "team",
            emailVerified: new Date(),
        })
        .returning();

    console.log("✅ Users seeded");

    // --- Companies ---
    const [acme] = await db
        .insert(companies)
        .values({
            name: "Acme Corp",
            website: "https://acme.com",
            industry: "Technology",
            email: "info@acme.com",
            phone: "+1-555-100-2000",
        })
        .returning();

    const [greenleaf] = await db
        .insert(companies)
        .values({
            name: "Greenleaf Organics",
            website: "https://greenleaf.co",
            industry: "Food & Beverage",
            email: "hello@greenleaf.co",
        })
        .returning();

    console.log("✅ Companies seeded");

    // --- Tags ---
    const tagData = [
        { name: "Hot Lead", color: "#ef4444" },
        { name: "Enterprise", color: "#8b5cf6" },
        { name: "Startup", color: "#06b6d4" },
        { name: "E-commerce", color: "#f59e0b" },
        { name: "SaaS", color: "#10b981" },
        { name: "Referral", color: "#ec4899" },
    ];

    const createdTags = await db.insert(tags).values(tagData).returning();
    console.log("✅ Tags seeded");

    // --- Leads ---
    const leadData = [
        {
            email: "james@techstartup.io",
            firstName: "James",
            lastName: "Wilson",
            company: "TechStartup.io",
            phone: "+1-555-200-3000",
            website: "https://techstartup.io",
            serviceInterest: ["SEO & Content Marketing", "Paid Advertising (PPC)"],
            budget: "$5,000 - $15,000/mo",
            timeline: "ASAP",
            source: "organic",
            utmSource: "google",
            utmMedium: "cpc",
            utmCampaign: "brand-awareness",
            status: "qualified" as const,
            score: 75,
            assignedToId: teamMember.id,
            companyId: acme.id,
        },
        {
            email: "maria@greenleaf.co",
            firstName: "Maria",
            lastName: "Santos",
            company: "Greenleaf Organics",
            serviceInterest: ["Social Media Management", "Brand Strategy"],
            budget: "$1,000 - $5,000/mo",
            timeline: "1-3 Months",
            source: "referral",
            status: "proposal" as const,
            score: 60,
            assignedToId: admin.id,
            companyId: greenleaf.id,
        },
        {
            email: "alex@megacorp.com",
            firstName: "Alex",
            lastName: "Chen",
            company: "MegaCorp",
            phone: "+1-555-300-4000",
            serviceInterest: ["Web Design & Development", "Email Marketing", "Analytics & Reporting"],
            budget: "$15,000 - $50,000/mo",
            timeline: "ASAP",
            source: "direct",
            status: "negotiation" as const,
            score: 90,
            assignedToId: teamMember.id,
        },
        {
            email: "priya@flowstate.app",
            firstName: "Priya",
            lastName: "Patel",
            company: "FlowState",
            serviceInterest: ["SEO & Content Marketing"],
            budget: "Under $1,000/mo",
            timeline: "3-6 Months",
            source: "organic",
            utmSource: "blog",
            utmMedium: "organic",
            status: "new" as const,
            score: 20,
        },
        {
            email: "tom@oldschool.biz",
            firstName: "Tom",
            lastName: "Baker",
            company: "OldSchool Biz",
            serviceInterest: ["Web Design & Development"],
            budget: "$1,000 - $5,000/mo",
            timeline: "Just Exploring",
            source: "paid",
            status: "lost" as const,
            score: 15,
        },
        {
            email: "lisa@ecomking.shop",
            firstName: "Lisa",
            lastName: "Tran",
            company: "E-Com King",
            phone: "+1-555-400-5000",
            website: "https://ecomking.shop",
            serviceInterest: ["Paid Advertising (PPC)", "Email Marketing", "Social Media Management"],
            budget: "$5,000 - $15,000/mo",
            timeline: "1-3 Months",
            source: "social",
            utmSource: "linkedin",
            utmMedium: "social",
            utmCampaign: "q1-promo",
            status: "qualified" as const,
            score: 65,
            assignedToId: admin.id,
        },
        {
            email: "derek@sunrise.health",
            firstName: "Derek",
            lastName: "Johnson",
            company: "Sunrise Health",
            serviceInterest: ["Brand Strategy", "Video Production"],
            budget: "$15,000 - $50,000/mo",
            timeline: "1-3 Months",
            source: "referral",
            status: "won" as const,
            score: 95,
            assignedToId: teamMember.id,
        },
        {
            email: "nina@artvault.gallery",
            firstName: "Nina",
            lastName: "Kowalski",
            company: "ArtVault Gallery",
            serviceInterest: ["Social Media Management", "Video Production"],
            budget: "$1,000 - $5,000/mo",
            timeline: "3-6 Months",
            source: "website",
            status: "new" as const,
            score: 30,
        },
        {
            email: "omar@finedge.capital",
            firstName: "Omar",
            lastName: "Hassan",
            company: "FinEdge Capital",
            phone: "+1-555-500-6000",
            serviceInterest: ["SEO & Content Marketing", "Analytics & Reporting"],
            budget: "$50,000+/mo",
            timeline: "ASAP",
            source: "direct",
            status: "proposal" as const,
            score: 85,
            assignedToId: admin.id,
        },
        {
            email: "chloe@petpal.app",
            firstName: "Chloe",
            lastName: "Wright",
            company: "PetPal",
            serviceInterest: ["Paid Advertising (PPC)"],
            budget: "Under $1,000/mo",
            timeline: "Just Exploring",
            source: "organic",
            status: "new" as const,
            score: 10,
        },
    ];

    const createdLeads = await db.insert(leads).values(leadData).returning();
    console.log("✅ Leads seeded");

    // --- Historical Leads (Last 30 Days) ---
    const historicalLeads = Array.from({ length: 20 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));

        return {
            email: `lead${i}@example.com`,
            firstName: `Historical`,
            lastName: `Lead ${i}`,
            company: `Company ${i}`,
            status: i % 3 === 0 ? "won" : i % 2 === 0 ? "qualified" : "new",
            source: i % 2 === 0 ? "linkedin" : "web_search",
            createdAt: date,
            updatedAt: date,
        };
    });

    // Combine with current leads
    await db.insert(leads).values(historicalLeads as any);
    console.log("✅ Historical leads seeded");

    // --- Tag associations ---
    await db.insert(leadsToTags).values([
        { leadId: createdLeads[0].id, tagId: createdTags[2].id }, // James → Startup
        { leadId: createdLeads[0].id, tagId: createdTags[0].id }, // James → Hot Lead
        { leadId: createdLeads[2].id, tagId: createdTags[1].id }, // Alex → Enterprise
        { leadId: createdLeads[2].id, tagId: createdTags[0].id }, // Alex → Hot Lead
        { leadId: createdLeads[5].id, tagId: createdTags[3].id }, // Lisa → E-commerce
        { leadId: createdLeads[6].id, tagId: createdTags[5].id }, // Derek → Referral
        { leadId: createdLeads[8].id, tagId: createdTags[1].id }, // Omar → Enterprise
        { leadId: createdLeads[8].id, tagId: createdTags[0].id }, // Omar → Hot Lead
        { leadId: createdLeads[3].id, tagId: createdTags[4].id }, // Priya → SaaS
    ]);
    console.log("✅ Lead-Tag associations seeded");

    // --- Lead Activities ---
    const activityData = [
        { type: "form_submit" as const, description: "Lead captured from website form", leadId: createdLeads[0].id },
        { type: "status_change" as const, description: "Status changed from new to qualified", leadId: createdLeads[0].id, userId: teamMember.id, metadata: { from: "new", to: "qualified" } },
        { type: "call" as const, description: "Discovery call - discussed SEO goals", leadId: createdLeads[0].id, userId: teamMember.id },
        { type: "form_submit" as const, description: "Lead captured from referral link", leadId: createdLeads[1].id },
        { type: "meeting" as const, description: "Strategy meeting - presented social media plan", leadId: createdLeads[1].id, userId: admin.id },
        { type: "status_change" as const, description: "Status changed from qualified to proposal", leadId: createdLeads[1].id, userId: admin.id, metadata: { from: "qualified", to: "proposal" } },
        { type: "form_submit" as const, description: "Lead captured from direct outreach", leadId: createdLeads[2].id },
        { type: "email_open" as const, description: "Opened proposal email", leadId: createdLeads[2].id },
        { type: "email_click" as const, description: "Clicked pricing page link", leadId: createdLeads[2].id },
        { type: "status_change" as const, description: "Status changed to negotiation", leadId: createdLeads[2].id, userId: teamMember.id, metadata: { from: "proposal", to: "negotiation" } },
        { type: "form_submit" as const, description: "Lead captured from blog post", leadId: createdLeads[3].id },
        { type: "page_visit" as const, description: "Visited pricing page", leadId: createdLeads[3].id, metadata: { page: "/pricing" } },
        { type: "form_submit" as const, description: "Lead captured from LinkedIn campaign", leadId: createdLeads[5].id },
        { type: "call" as const, description: "Intro call - e-commerce growth plan", leadId: createdLeads[5].id, userId: admin.id },
        { type: "status_change" as const, description: "Won deal - full service package", leadId: createdLeads[6].id, userId: teamMember.id, metadata: { from: "negotiation", to: "won" } },
    ];

    await db.insert(leadActivities).values(activityData);
    console.log("✅ Lead activities seeded");

    // --- Historical Activities ---
    // Re-fetch all leads to attach activities
    const allLeads = await db.select().from(leads);

    const activityTypes = ["email_open", "page_visit", "call", "meeting", "form_submit"];
    const historicalActivitiesData = allLeads.flatMap(lead => {
        // Generate 0-3 activities per lead
        const count = Math.floor(Math.random() * 4);
        return Array.from({ length: count }).map(() => {
            // Activity happened after lead creation
            const leadDate = new Date(lead.createdAt);
            const date = new Date(leadDate);
            date.setDate(date.getDate() + Math.floor(Math.random() * 5));

            // Ensure activity isn't in the future
            if (date > new Date()) return null;

            return {
                type: activityTypes[Math.floor(Math.random() * activityTypes.length)],
                description: "Automated activity log",
                leadId: lead.id,
                createdAt: date,
            };
        }).filter(Boolean); // Filter out nulls
    });

    if (historicalActivitiesData.length > 0) {
        await db.insert(leadActivities).values(historicalActivitiesData as any);
        console.log("✅ Historical activities seeded");
    }

    // --- Lead Notes ---
    const noteData = [
        { content: "Very interested in SEO for their SaaS product launch. Budget approved by their CTO. Follow up next week.", leadId: createdLeads[0].id, userId: teamMember.id },
        { content: "Greenleaf wants Instagram-focused strategy. They have great product photography already.", leadId: createdLeads[1].id, userId: admin.id },
        { content: "MegaCorp is our biggest opportunity this quarter. They need full-stack marketing for their enterprise product line. Decision expected by end of month.", leadId: createdLeads[2].id, userId: teamMember.id },
        { content: "Signed 12-month retainer. $18k/mo for brand strategy + video production. Great referral from existing client.", leadId: createdLeads[6].id, userId: teamMember.id },
        { content: "Enterprise client, high budget. Wants detailed analytics dashboards. Schedule demo of our reporting tools.", leadId: createdLeads[8].id, userId: admin.id },
    ];

    await db.insert(leadNotes).values(noteData);
    console.log("✅ Lead notes seeded");

    // --- Testimonials ---
    const testimonialData = [
        {
            name: "Sarah Chen",
            title: "CEO",
            company: "GrowthLab Digital",
            quote: "OrbixDigital transformed how we manage our pipeline. We closed 3x more deals in the first quarter after switching.",
            rating: 5,
            featured: true,
        },
        {
            name: "Marcus Rivera",
            title: "Head of Operations",
            company: "Brightwave Media",
            quote: "The lead capture and CRM integration is seamless. Our team saves 10+ hours per week on manual data entry.",
            rating: 5,
            featured: true,
        },
        {
            name: "Emily Zhao",
            title: "Founder",
            company: "Pixel & Pulse",
            quote: "Finally, a platform built specifically for businesses. The pipeline view alone is worth the switch from our old CRM.",
            rating: 5,
            featured: true,
        },
        {
            name: "David Kim",
            title: "Director",
            company: "Apex Marketing",
            quote: "Customer support is incredible and the platform keeps getting better every week.",
            rating: 4,
            featured: false,
        },
    ];

    await db.insert(testimonials).values(testimonialData);
    console.log("✅ Testimonials seeded");

    // --- Client User ---
    const [clientUser] = await db
        .insert(users)
        .values({
            name: "Alice Client",
            email: "alice@acme.com",
            passwordHash,
            role: "client",
            emailVerified: new Date(),
            companyId: acme.id,
        })
        .returning();
    console.log("✅ Client User seeded");

    // --- Deliverables ---
    await db.insert(deliverables).values([
        {
            title: "Q1 Marketing Strategy Deck",
            description: "Comprehensive strategy including SEO, PPC, and Content plans for the first quarter.",
            status: "approved",
            companyId: acme.id,
            docLink: "https://docs.google.com/presentation/example",
            dueDate: new Date("2026-01-15"),
        },
        {
            title: "Homepage Hero Design V2",
            description: "Updated high-fidelity mockups for the new homepage hero section based on previous feedback.",
            status: "pending_review",
            companyId: acme.id,
            docLink: "https://figma.com/file/example",
            previewImage: "https://placehold.co/600x400/png",
            dueDate: new Date("2026-02-20"),
        },
        {
            title: "Social Media Assets - March",
            description: "Batch of 15 social media posts for Instagram and LinkedIn.",
            status: "draft",
            companyId: acme.id,
            dueDate: new Date("2026-03-01"),
        },
    ]);
    console.log("✅ Deliverables seeded");

    // --- Tickets ---
    await db.insert(tickets).values([
        {
            title: "Update Team Page photos",
            description: "We have new headshots for the executive team. Please update the About page.",
            priority: "medium",
            status: "open",
            companyId: acme.id,
            requesterId: clientUser.id,
        },
        {
            title: "Landing page conversion issue",
            description: "The form on the landing page seems to be throwing an error on mobile.",
            priority: "high",
            status: "in_progress",
            companyId: acme.id,
            requesterId: clientUser.id,
            assignedToId: teamMember.id,
        },
        {
            title: "Q4 Report Revision",
            description: "Can we get a breakdown of PPC spend by campaign in the last report?",
            priority: "low",
            status: "resolved",
            companyId: acme.id,
            requesterId: clientUser.id,
            assignedToId: admin.id,
        },
    ]);
    console.log("✅ Tickets seeded");

    console.log("✅ Seed complete!");
    process.exit(0);
}

seed().catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
});
