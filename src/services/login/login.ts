'use server'

import {redirect} from "next/navigation";
import {
  DIVER_STATE,
  encryptRandomValue,
  generateCodeChallenge,
  generateCodeVerifier,
  generateState
} from "@/utils/cripto";
import {cookies} from 'next/headers';
import {cookiesMap} from "@/utils/config.ts";
import {IS_DEVELOP, ORIGIN, TWITTER_CLIENT_ID} from "../../../next.config.ts";
const scope = 'tweet.read tweet.write tweet.moderate.write users.read follows.read follows.write offline.access space.read mute.read mute.write like.read like.write list.read like.write block.read block.write bookmark.write bookmark.read'


export async function login() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const maxAge = 60 * 60;

  const cookieStore = await cookies()
  let stateWithRoute = cookieStore.get(cookiesMap.stateWithRoute)?.value
  cookieStore.delete(cookiesMap.stateWithRoute)
  let state: string;
  let route: string;

  if(stateWithRoute === undefined) {
    state = generateState()
    route = btoa('/home')
    stateWithRoute = await encryptRandomValue(state) + DIVER_STATE + route;
  } else {
    try {
      const parts = stateWithRoute.split(DIVER_STATE)
      state = await encryptRandomValue(parts[0])
      route = parts[1]
    } catch {
      console.log(`Error: encrypting state in login: StateWithRoute: ${stateWithRoute}`)
      redirect('/login')
    }
  }

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: TWITTER_CLIENT_ID,
    redirect_uri: ORIGIN + '/redirect',
    scope,
    state: state + DIVER_STATE + route,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  })

  const authUrl = `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
  const secure = !IS_DEVELOP;

  cookieStore.set({
    name: cookiesMap.stateWithRoute,
    value: stateWithRoute,
    secure,
    httpOnly: true,
    sameSite: 'lax',
    maxAge,
  });

  cookieStore.set({
    name: cookiesMap.codeVerifier,
    value: codeVerifier,
    secure,
    httpOnly: true,
    sameSite: 'lax',
    maxAge,
  });

  redirect(authUrl);
}