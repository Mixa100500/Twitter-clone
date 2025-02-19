import {getAccessToken} from "@/utils/request.ts";
import {BASE_URL} from "@/app/api/utils/twitterApi.ts";

export type IdToken = {
  data: {
    username: 'string',
    name: 'string',
    id: 'string'
  }
}

export async function GET() {
  const token = await getAccessToken();

  const data = await fetch(BASE_URL + 'users/me', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });

  const result = await data.json()

  return Response.json(result)
}