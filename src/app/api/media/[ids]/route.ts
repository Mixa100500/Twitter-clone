// import {cookies} from "next/headers";
// import {cookiesMap} from "@/utils/config.ts";
import {MediaByKey} from "@/feature/tweets/types.ts";
import {ResultMedia, resultMediaByIds} from "@/app/api/media/[ids]/results.ts";
import {cookiesMap} from "@/utils/config.ts";
import {cookies} from "next/headers";
import {AUTHORIZATION} from "../../../../../next.config.ts";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ ids: string }> }
) {
  const ids = (await params).ids
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

  result.includes.media.forEach(media => {
    const id = media.media_key.slice(2);
    mediaById[id] = media
  })

  return Response.json(mediaById)
}