import {cookiesMap} from "@/utils/config.ts";
import {cookies} from "next/headers";
import {decryptJwt} from "@/utils/cripto.ts";

export async function getAccessToken () {
  const cookieStore = await cookies()
  return cookieStore.get(cookiesMap.accessToken)?.value
}

export async function getIdToken () {
  const cookieStore = await cookies()
  const idToken = cookieStore.get(cookiesMap.idToken)?.value
  if(!idToken) {
    return undefined
  }

  return decryptJwt(idToken)
}