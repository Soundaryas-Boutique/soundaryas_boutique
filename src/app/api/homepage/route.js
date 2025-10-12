import { getHomepageSarees } from "@/app/lib/sarees";

export async function GET(req) {
  try {
    const data = await getHomepageSarees(5);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch homepage data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
