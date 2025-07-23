import {InitialTweet, Medias, ReferencedTweet, Tweet, TweetById, TweetPage} from "@/feature/tweets/types.ts";
import {getMedias, getTweetMediaServer, getTweets, getTweetServer} from "@/feature/tweets/requests.ts";
import {createStore} from "@/feature/createStore.ts";
import {cookies} from "next/headers";
import {cookiesMap} from "@/utils/config.ts";
import {AUTHORIZATION} from "../../../next.config.ts";

const ElonId = "44196397"
// type RemoveById = Record<string, string>

export interface TweetStore {
  tweets: {
    byId: TweetById,
    allIds: string[],
  },
  pages: {
    byId: Record<string, TweetPage>,
    allIds: string[],
  },
  error: false,
  request: (isNext: boolean, token?: string) => Promise<void>,
  getTokens: () => [prevToken?: string, nextToken?: string],
}

export const useTweets = createStore<TweetStore>((set, get) => ({
  tweets: {
    byId: {},
    allIds: []
  },
  pages: {
    byId: {},
    allIds: []
  },

  timers: {},
  subscribersById: {},
  error: false,
  request: async (isNext, paginationToken) => {
    const result = await getTweets(ElonId, paginationToken);
    // console.log(result)
    const tweetById: TweetById = {};
    const tweetsIds: string[] = [];
    const state = get();
    const pageId = result.tweets[0].id;
    const tweets: string[] = [];

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

    let pagesAllIds: string[];
    let newTweetAllIds: string[];

    if(isNext) {
      pagesAllIds = [
        ...state.pages.allIds,
        pageId,
      ]
      newTweetAllIds = [
        ...state.tweets.allIds,
        ...tweetsIds
      ]
    } else {
      pagesAllIds = [
        pageId,
        ...state.pages.allIds,
      ]
      newTweetAllIds = [
        ...tweetsIds,
        ...state.tweets.allIds
      ]
    }

    set((state) => ({
      tweets: {
        byId: {
          ...state.tweets.byId,
          ...tweetById,
        },
        allIds: newTweetAllIds,
      },
      pages: {
        byId: {
          ...state.pages.byId,
          [pageId]: page
        },
        allIds: pagesAllIds,
      }
    }))

    const medias = await getMedias(result.refIds)
    console.log(medias, 2)
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

    set((state) => ({
      tweets: {
        ...state.tweets,
        byId: {
          ...state.tweets.byId,
          ...newTweetById,
        }
      },
    }))
  },
  getTokens: () => {
    const state = get();
    const { allIds, byId } = state.pages
    const firstPageId = allIds[0];
    let lastPageId = allIds.at(-1);
    if(lastPageId === undefined) {
      lastPageId = ''
    }

    const firstPage = byId[firstPageId];
    const lastPage = byId[lastPageId];

    return [firstPage?.prevToken, lastPage?.nextToken]
  },
}), 'tweets')


export const createPlayerStore = (
  initState: InitialTweet
) => {
  return createStore<TweetStore>((set, get) => ({
    ...initState,
    error: false,
    request: async (isNext, paginationToken) => {
      const result = await getTweets(ElonId, paginationToken);
      const tweetById: TweetById = {};
      const tweetsIds: string[] = [];
      const state = get();
      const pageId = result.tweets[0].id;
      const tweets: string[] = [];

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

      let pagesAllIds: string[];
      let newTweetAllIds: string[];

      if(isNext) {
        pagesAllIds = [
          ...state.pages.allIds,
          pageId,
        ]
        newTweetAllIds = [
          ...state.tweets.allIds,
          ...tweetsIds
        ]
      } else {
        pagesAllIds = [
          pageId,
          ...state.pages.allIds,
        ]
        newTweetAllIds = [
          ...tweetsIds,
          ...state.tweets.allIds
        ]
      }

      set((state) => ({
        tweets: {
          byId: {
            ...state.tweets.byId,
            ...tweetById,
          },
          allIds: newTweetAllIds,
        },
        pages: {
          byId: {
            ...state.pages.byId,
            [pageId]: page
          },
          allIds: pagesAllIds,
        }
      }))

      const medias = await getMedias(result.refIds)
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

      set((state) => ({
        tweets: {
          ...state.tweets,
          byId: {
            ...state.tweets.byId,
            ...newTweetById,
          }
        },
      }))
    },
    getTokens: () => {
      const state = get();
      const { allIds, byId } = state.pages
      const firstPageId = allIds[0];
      let lastPageId = allIds.at(-1);
      if(lastPageId === undefined) {
        lastPageId = ''
      }

      const firstPage = byId[firstPageId];
      const lastPage = byId[lastPageId];

      return [firstPage?.prevToken, lastPage?.nextToken]
    },
  }), 'tweets')
}
