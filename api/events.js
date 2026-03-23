const UPSTREAM_EVENTS_URL =
  process.env.EVENTS_API_URL ?? "https://mma-events-api.vercel.app/events";

export default async function handler(request, response) {
  try {
    const upstreamResponse = await fetch(UPSTREAM_EVENTS_URL, {
      headers: {
        accept: "application/json",
      },
    });

    if (!upstreamResponse.ok) {
      return response
        .status(upstreamResponse.status)
        .json({ error: "Upstream events request failed." });
    }

    const data = await upstreamResponse.json();

    response.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=3600");
    return response.status(200).json(data);
  } catch (error) {
    return response.status(502).json({
      error: "Unable to load events from the upstream feed.",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
