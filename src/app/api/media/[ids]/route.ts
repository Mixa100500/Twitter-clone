// import {cookies} from "next/headers";
// import {cookiesMap} from "@/utils/config.ts";
import {MediaByKey, MediaWithHls} from "@/feature/tweets/types.ts";
import {ResultMedia,
  resultMediaByIds
} from "@/app/api/media/[ids]/results.ts";
import {cookiesMap} from "@/utils/config.ts";
import {cookies} from "next/headers";
import {AUTHORIZATION} from "../../../../../next.config.ts";
import {normalizeTweetsMedia} from "@/feature/tweets/normalised.ts";
// const queries = [
//   'tweet.fields=public_metrics,created_at,author_id,text',
//   'expansions=attachments.media_keys,referenced_tweets.id,entities.mentions.username,author_id,referenced_tweets.id.author_id',
//   'user.fields=entities,profile_image_url',
//   // 'exclude=replies',
//   'media.fields=media_key,type,url,preview_image_url,variants,width,height'
// ].join('&');

export async function GET(
  request: Request,
  { params }: { params: Promise<{ ids: string }> }
) {
  const ids = (await params).ids
  // const id = "1903807726586634452";
  const cookieStore = await cookies()
  const access = cookieStore.get(cookiesMap.accessToken)?.value

  const token = access ? access : AUTHORIZATION

  const resultFormCache = resultMediaByIds[ids]
  const mediaById: MediaByKey = {}
  let result: ResultMedia;

  if(
    resultFormCache
  ) {
    result = resultFormCache
  } else {
    result = await fetch(`https://api.x.com/2/tweets?ids=${ids}&expansions=attachments.media_keys&media.fields=media_key,type,url,preview_image_url,variants,width,height`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).then(res => res.json())

    return Response.json(result)
  }

  // result.includes.media.forEach(media => {
  //   const hlsUrl = media.variants?.find(e => e.content_type === 'application/x-mpegURL')?.url
  //   console.log('media')
  //   console.log(media.variants)
  //   console.log(hlsUrl)
  //   const mediaWithHls: MediaWithHls = {
  //     ...media,
  //     hlsUrl,
  //   }
  //
  //   const id = media.media_key.slice(2);
  //   mediaById[id] = mediaWithHls
  // })



  return Response.json(normalizeTweetsMedia(result))
}