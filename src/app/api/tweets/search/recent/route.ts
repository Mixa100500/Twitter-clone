import {getAccessToken, getIdToken} from "@/utils/request.ts";

const path = 'https://api.x.com/2/users/'

export type MeResponse = {
  data: {
    id: string,
    name: string,
    username: string
  }
}

export async function GET(
  // request: Request,
) {
  const token = await getAccessToken()
  const idToken = await getIdToken()

  const result = await fetch(path + idToken + idToken + '/tweets', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  }).then(res => res.json()).catch(console.log)


  // const result = TwitterClient.get(path, {
  //   headers: {
  //     'Authorization': 'Bearer ' + token
  //   }
  // }).catch(console.log);

  return result.data
}