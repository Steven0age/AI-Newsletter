import { fetchArticles } from "@/lib/news";
import { inngest } from "../client";

export default inngest.createFunction(
  { id: "newsletter/scheduled", triggers: [{ event: "newsletter.schedule" }] },
  async ({ event, step, runId }) => {
    // Fetch artilcles per category
    const categories = ["technology", "business", "politics"];
    const allArticles = await step.run("fetch-news", async () => {
      return fetchArticles(categories);
    });

    // generate ai summary

    const summary = await step.ai.infer("summarize-news", {
      model: step.ai.models.openai({ model: "gpt-4o" }),
      body: {
        messages: [
          {
            role: "system",
            content: `you are an expoert newsletter editor creating a personalizd newsletter.
                    Write a concise, engaging summary that:
- Highlights the most important stories
- Provides context and insights
- Uses a friendly, conversational tone
- Is well-structured with clear sections
- Keeps the reader informed and engaged
Format the response as a proper newsletter with a title and organized content.
Make it email-friendly with clear sections and engaging subject lines.`,
          },
          {
            role: "user",
            content: `create a newsletter summary for these articles from the past week.
                categories requested: ${categories.join(", ")}
                
                Articles:
                ${allArticles
                  .map(
                    (
                      article: any,
                      idx: number,
                    ) => `${idx + 1}. ${article.title}\n 
                  ${article.description}
                    \n Source: ${article.url}\n
                `,
                  )
                  .join("\n")}
                `,
          },
        ],
      },
    });

    console.log("summary =", summary.choices[0].message.content);
  },
);
