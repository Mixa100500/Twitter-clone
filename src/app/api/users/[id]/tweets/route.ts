// import {cookies} from "next/headers";
// import {cookiesMap} from "@/utils/config.ts";
import {NextRequest} from "next/server";
import {cookies} from "next/headers";
import {cookiesMap} from "@/utils/config.ts";
import {firstResult, resultByToken} from "@/app/api/users/[id]/tweets/results.ts";
import {AUTHORIZATION} from "../../../../../../next.config.ts";
import {normalizeTweets} from "@/feature/tweets/normalised.ts";

const queries = [
  'tweet.fields=public_metrics,created_at,author_id,text',
  'expansions=attachments.media_keys,referenced_tweets.id,entities.mentions.username,author_id,referenced_tweets.id.author_id',
  'user.fields=entities,profile_image_url',
  'exclude=replies',
  'media.fields=media_key,type,url,preview_image_url,variants,width,height'
].join('&');

export async function GET(
  request: NextRequest,
  // { params }: { params: Promise<{ id: string }> }
) {

  // const id = (await params)?.id
  const searchParams = request.nextUrl.searchParams
  const pagination_token = searchParams.get('pagination_token')
  const cookieStore = await cookies()
  const access = cookieStore.get(cookiesMap.accessToken)?.value
  const token = access ? access : AUTHORIZATION

  if(pagination_token) {

    const resultFromCache = resultByToken[pagination_token]

    if(
      resultFromCache
    ) {
      return Response.json(normalizeTweets(resultFromCache))
    }

    const result = await fetch('https://api.x.com/2/users/' + '44196397' + '/tweets?' + queries + "&pagination_token=" + pagination_token, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then(res => res.json())
      .catch(console.log)

    console.log(result)

    return Response.json(result)
  }



  // const cookieStore = await cookies()
  // const access = cookieStore.get(cookiesMap.accessToken)?.value
  // const id = (await params).id

  // const result = await fetch('https://api.x.com/2/users/' + '44196397' + '/tweets?' + queries, {
  //   headers: {
  //     'Authorization': 'Bearer ' + token
  //   }
  // })
  //   .then(res => res.json())
  //   .catch(console.log)
  // console.log(result)
  // return Response.json(result)
  // return new Response(result.data, {
  //   headers: { 'Content-Type': 'application/json' },
  // })

  const tweets = normalizeTweets(firstResult)

  return Response.json(tweets)
}

// export function delay(ms: fortmats): Promise<void> {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }