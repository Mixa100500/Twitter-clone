// import {cookies} from "next/headers";
// import {cookiesMap} from "@/utils/config.ts";
import {
  Media,
  TweetLineNormalized,
  TweetLineUnresolved,
  Tweet,
  TweetUnresolved,
  UserProfile,
  InnerReferencedTweet
} from "@/feature/tweets/types.ts";
import {NextRequest} from "next/server";
import {cookies} from "next/headers";
import {cookiesMap} from "@/utils/config.ts";
import {firstResult, resultByToken} from "@/app/api/users/[id]/tweets/results.ts";
import {AUTHORIZATION} from "../../../../../../next.config.ts";

function normalizeTweets(data: TweetLineUnresolved): TweetLineNormalized {
  const tweetsNormalized: Tweet[] = [];
  const referencedTweetsById: Record<string, TweetUnresolved> = {};
  const usersById: Record<string, UserProfile> = {};
  const mediaByKey: Record<string, Media> = {};
  const tweets = data.data;
  let refIds: string = '';

  data.includes.users.forEach((user) => {
    usersById[user.id] = user;
  });

  if (data.includes.media) {
    data.includes.media.forEach((media) => {
      mediaByKey[media.media_key] = media;
    });
  }

  if (data.includes.tweets) {
    data.includes.tweets.forEach((includedTweet) => {
      referencedTweetsById[includedTweet.id] = includedTweet;
    });
  }

  if (tweets) {
    const firstId = tweets[0].id
    tweets.forEach((tweet, index) => {

      const medias = tweet.attachments?.media_keys?.map(media => {
        return mediaByKey[media]
      })

      const tweetBase: Tweet = {
        public_metrics: tweet.public_metrics,
        edit_history_tweet_ids: tweet.edit_history_tweet_ids,
        created_at: tweet.created_at,
        id: tweet.id,
        author_id: tweet.author_id,
        text: tweet.text,
        attachments: tweet.attachments,
        entities: tweet.entities,
        author: usersById[tweet.author_id],
        medias,
        pageId: firstId,
      }

      if (tweet.referenced_tweets && tweet.referenced_tweets.length > 0) {
        const ref = tweet.referenced_tweets[0];
        const refId = ref.id;

        if(tweets.length === index) {
          refIds += ref.id
        } else {
          refIds += (ref.id + ',');
        }
        const base = referencedTweetsById[refId]

        const referencedTweet: InnerReferencedTweet = {
          public_metrics: base.public_metrics,
          edit_history_tweet_ids: base.edit_history_tweet_ids,
          created_at: base.created_at,
          id: base.id,
          author_id: base.author_id,
          text: base.text,
          attachments: base.attachments,
          entities: base.entities,
          author: usersById[base.author_id],
        }

        tweetBase.referenced_tweet = {
          type: ref.type,
          id: ref.id,
          base: referencedTweet,
        }

        tweetsNormalized.push(tweetBase)
        return
      }

      tweetsNormalized.push(tweetBase)
    });
  }

  refIds = refIds.slice(0, -1)
  return {
    refIds,
    meta: data.meta,
    tweets: tweetsNormalized,
  }
}

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

    if(resultFromCache) {
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