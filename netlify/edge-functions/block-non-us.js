export default async (request, context) => {
  const userAgent = (request.headers.get("user-agent") || "").toLowerCase();

  // Whitelist reputable search engines & AI crawlers
  const allowedBots = [
    "googlebot",
    "bingbot",
    "gptbot",
    "chatgpt-user",
    "claudebot",
    "perplexitybot",
    "google-extended",
    "ccbot",
    "applebot",
    "duckduckbot",
    "slurp",
    "baiduspider",
    "yandexbot"
  ];

  const isAllowedBot = allowedBots.some((bot) => userAgent.includes(bot));

  if (isAllowedBot) {
    return context.next();
  }

  // Check visitor country code from Netlify Geo headers
  const country = context.geo?.country?.code;

  // Allow US and internal/local development (undefined/null)
  if (!country || country === "US") {
    return context.next();
  }

  // Block all other non-US human traffic
  return new Response("Access restricted: Services only available within the United States.", {
    status: 403,
    headers: { "Content-Type": "text/plain" },
  });
};