import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "ai-newsletter-app",
  name: "Personalized Newsletter Generator",
  eventKey: process.env.INNGEST_EVENT_KEY,
});
