import 'server-only'
// import {TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET} from "../../../../next.config.ts";
// import {AUTHORIZATION} from "../../../../next.config.ts";
const AUTHORIZATION = process.env.TWITTER_CLIENT_ID + ':' + process.env.TWITTER_CLIENT_SECRET

const url = 'https://api.x.com/2/oauth2/token';

export async function refresh (token: string) {
  const body = new URLSearchParams({
    refresh_token: token,
    grant_type: 'refresh_token',
  });

  return await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + AUTHORIZATION
    },
    body,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
}