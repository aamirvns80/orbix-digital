import { createTRPCRouter } from "./server";
import { usersRouter } from "./routers/users";
import { contactsRouter } from "./routers/contacts";
import { companiesRouter } from "./routers/companies";
import { contentRouter } from "./routers/content";
import { activityRouter } from "./routers/activity";
import { leadsRouter } from "./routers/leads";
import { leadActivitiesRouter } from "./routers/lead-activities";
import { leadNotesRouter } from "./routers/lead-notes";
import { tagsRouter } from "./routers/tags";
import { testimonialsRouter } from "./routers/testimonials";
import { deliverablesRouter } from "./routers/deliverables";
import { ticketsRouter } from "./routers/tickets";
import { analyticsRouter } from "./routers/analytics";
import { notificationsRouter } from "./routers/notifications";
import { invoicesRouter } from "./routers/invoices";
import { integrationsRouter } from "./routers/integrations";
import { proposalsRouter } from "./routers/proposals";

export const appRouter = createTRPCRouter({
    users: usersRouter,
    contacts: contactsRouter,
    companies: companiesRouter,
    content: contentRouter,
    activity: activityRouter,
    leads: leadsRouter,
    leadActivities: leadActivitiesRouter,
    leadNotes: leadNotesRouter,
    tags: tagsRouter,
    testimonials: testimonialsRouter,
    deliverables: deliverablesRouter,
    tickets: ticketsRouter,
    analytics: analyticsRouter,
    notifications: notificationsRouter,
    invoices: invoicesRouter,
    integrations: integrationsRouter,
    proposals: proposalsRouter,
});

export type AppRouter = typeof appRouter;
