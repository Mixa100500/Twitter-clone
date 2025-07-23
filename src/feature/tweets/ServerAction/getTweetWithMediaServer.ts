'use server'

import {InitialTweet, Medias, ReferencedTweet, Tweet, TweetById, TweetPage} from "@/feature/tweets/types.ts";
import {cookies} from "next/headers";
import {cookiesMap} from "@/utils/config.ts";
import {AUTHORIZATION} from "../../../../next.config.ts";
import {getTweetMediaServer, getTweetServer} from "@/feature/tweets/requests.ts";
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const getTweetWithMediaServer = async (): Promise<InitialTweet> => {
  const cookieStore = await cookies();
  const access = cookieStore.get(cookiesMap.accessToken)?.value;
  const token = access ? access : AUTHORIZATION;

  await sleep(2000);
  const result = await getTweetServer(token);

  const tweetById: TweetById = {};
  const tweetsIds: string[] = [];
  const pageId = result.tweets[0].id;
  const tweets: string[] = [];
  let resolved: InitialTweet = {
    tweets: {
      byId: {},
      allIds: []
    },
    pages: {
      byId: {},
      allIds: []
    },
  }

  result.tweets.forEach((tweet) => {
    tweetsIds.push(tweet.id)
    tweets.push(tweet.id)
    tweetById[tweet.id] = tweet
  })

  const page: TweetPage = {
    nextToken: result.meta.next_token,
    prevToken: result.meta.previous_token,
    tweets,
  }

  const pagesAllIds: string[] = [
    pageId,
  ]
  const newTweetAllIds: string[] = [
    ...tweetsIds,
  ]

  resolved = {
    tweets: {
      byId: {
        ...tweetById,
      },
      allIds: newTweetAllIds,
    },
    pages: {
      byId: {
        [pageId]: page
      },
      allIds: pagesAllIds,
    }
  }

  const medias = await getTweetMediaServer(token, result.refIds)
  const newTweetById: TweetById = {}

  tweetsIds.forEach((id) => {
    const oldTweet = tweetById[id]

    const newTweet: Tweet = {
      ...oldTweet
    }

    const keys = oldTweet.referenced_tweet?.base.attachments?.media_keys
    const refTweetMedias: Medias = []

    if(keys) {

      keys.forEach(key => {
        refTweetMedias.push(medias[key.slice(2)])
      })

      if(oldTweet.referenced_tweet?.base) {
        const newRefTweet: ReferencedTweet = {
          ...oldTweet.referenced_tweet,
          base: {
            ...oldTweet.referenced_tweet?.base,
            medias: refTweetMedias,
          }
        }

        newTweet.referenced_tweet = newRefTweet
      }
    }

    newTweetById[id] = newTweet
  })

  resolved = {
    tweets: {
      ...resolved.tweets,
      byId: {
        ...resolved.tweets.byId,
        ...newTweetById,
      }
    },
    pages: {
      ...resolved.pages
    }
  }

  return resolved
}