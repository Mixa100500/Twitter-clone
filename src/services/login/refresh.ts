import 'server-only'
import {TWITTER_CLIENT_ID} from "../../../next.config.ts";

export async function refresh (token: string) {
  const url = 'https://api.x.com/2/oauth2/token';
  const body = new URLSearchParams({
    refresh_token: token,
    grant_type: 'refresh_token',
    client_id: TWITTER_CLIENT_ID,
  });

  return await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
}