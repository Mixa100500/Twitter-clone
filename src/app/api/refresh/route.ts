import {BASE_URL} from "@/app/api/utils/twitterApi.ts";

export async function POST(
  // request: Request,
) {
  return await fetch(BASE_URL + "oauth2/token", { method: 'POST' })
}
