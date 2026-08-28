export default async (request, context) => {
  const userAgent = request.headers.get("user-agent")?.toLowerCase() || "";
  const countryCode = context.geo?.country?.code;

  // Allow verified search engine bots to maintain US search visibility
  const isBot = /googlebot|bingbot|duckduckbot|slurp|yandexbot|baiduspider|facebookexternalhit|twitterbot|linkedinbot/.test(userAgent);

  if (isBot) {
    return context.next();
  }

  // Block all non-US visitors
  if (countryCode && countryCode !== "US") {
    return new Response(
      "<h1>403 Forbidden</h1><p>Access is restricted to visitors within the United States.</p>",
      {
        status: 403,
        headers: { "Content-Type": "text/html" },
      }
    );
  }

  return context.next();
};