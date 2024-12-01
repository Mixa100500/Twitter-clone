'use server'

import {redirect} from "next/navigation";
import {AUTHORIZATION, ORIGIN} from "../../../next.config.ts";
import {decryptRandomValue, DIVER_STATE} from "@/utils/cripto.ts";
import {cookies} from "next/headers";
import {cookiesMap} from "@/utils/config.ts";

type canString = string | null

export async function authByCode (code: canString, stateFormUrl: canString) {
  const cookiesStore = await cookies()
  const encryptedStateWithRoute = cookiesStore.get(cookiesMap.stateWithRoute)?.value
  cookiesStore.delete(cookiesMap.stateWithRoute)
  const code_verifier = cookiesStore.get(cookiesMap.codeVerifier)?.value
  cookiesStore.delete(cookiesMap.codeVerifier)

  if(code_verifier === undefined) {
    redirect('/login')
    return
  }

  if(code === null) {
    redirect('/login')
    return
  }

  if(stateFormUrl === null) {
    redirect('/login')
    return
  }

  if(encryptedStateWithRoute === undefined) {
    redirect('/login')
    return
  }

  const parts = encryptedStateWithRoute.split(DIVER_STATE)

  if(parts[1] === undefined) {
    redirect('/login')
    return
  }

  if(parts[0] === undefined) {
    redirect('/login')
  }

  const stateFromCookies = await decryptRandomValue(parts[0]);
  const route = atob(parts[1]);

  if(stateFromCookies === stateFormUrl) {
    redirect('/401');
    return;
  }
  const redirect_uri = ORIGIN + '/redirect';

  const accessToken = await fetch('https://api.x.com/2/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + AUTHORIZATION
    },
    body: new URLSearchParams({
      code,
      grant_type: 'authorization_code',
      redirect_uri,
      code_verifier,
    }),
  })

  const resposne = await accessToken.json();
  console.log('redirect callback')
  console.log(resposne);

  console.log(accessToken);
  console.log('was route:', route)
}