import {Medias, ReferencedTweet, Tweet} from "@/feature/tweets/types.ts";
import {getMedias, getTweets} from "@/feature/tweets/requests.ts";
import {createStore} from "@/feature/createStore.ts";

const ElonId = "44196397"

type ById = Record<string, Tweet>
// type RemoveById = Record<string, string>
type Page = {
  nextToken?: string,
  prevToken?: string,
  tweets: string[],
}

interface Store {
  tweets: {
    byId: ById,
    allIds: string[],
  },
  pages: {
    byId: Record<string, Page>,
    allIds: string[],
  },
  timers: Record<string, ReturnType<typeof setTimeout>>
  subscribersById: Record<string, number>,
  subscribe: (id: string) => void,
  unsubscribe: (id: string) => void,
  error: false,
  request: (isNext: boolean, token?: string) => Promise<void>,
  clearPage: (pageId: string) => void,
  getTokens: () => [prevToken?: string, nextToken?: string],
  isShifting: boolean;
  getIsShifting: () => boolean,
  setIsShifting: (bol: boolean) => void,
}

export const useTweets = createStore<Store>((set, get) => ({
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
  subscribe: (id) => {
    set((state) => {
      const count = state.subscribersById[id]
      let newCount: number;
      if(count) {
        newCount = count + 1;
      } else {
        const timer = state.timers[id]
        clearTimeout(timer);
        newCount = 1;
      }
      return {
        subscribersById: {
          ...state.subscribersById,
          [id]: newCount,
        }
      }
    })
  },
  unsubscribe: (id) => {
    set((state) => {
      // debugger;
      const subscribers = state.subscribersById[id];
      const subscribersById = state.subscribersById;

      if(subscribers === 1) {
        const timeOutId: ReturnType<typeof setTimeout> = setTimeout(() => {
          const clearPage = state.clearPage
          clearPage(id)
          console.log('clear')
          set((state) => {
            delete state.timers[id];
            return {
              timers: {
                ...state.timers
              },
              isShifting: true
            };
          })
        }, 10000);

        delete subscribersById[id]

        return {
          subscribersById: {
            ...subscribersById,
          },
          timers: {
            ...state.timers,
            [id]: timeOutId,
          }
        }
      } else {
        const newSubscribers = subscribers - 1;
        return {
          subscribersById: {
            ...subscribersById,
            [id]: newSubscribers,
          }
        }
      }
    })
  },
  request: async (isNext, paginationToken) => {
    const result = await getTweets(ElonId, paginationToken);
    // console.log(result)
    const tweetById: ById = {};
    const tweetsIds: string[] = [];
    const state = get();
    const pageId = result.tweets[0].id;
    const tweets: string[] = [];

    result.tweets.forEach((tweet) => {
      tweetsIds.push(tweet.id)
      tweets.push(tweet.id)
      tweetById[tweet.id] = tweet
    })

    const page: Page = {
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

    if(!isNext) {
      console.log('set shifting')
      set({isShifting: true})
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
    const newTweetById: ById = {}

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
  clearPage: (pageId) => {
    const state = get();
    const { allIds: pagesAllIds, byId: pagesById } = state.pages;
    const { allIds: tweetsAllIds, byId: tweetsById } = state.tweets;
    const firstPageId = pagesAllIds[0];

    const page = pagesById[pageId];
    let newTweetsAllIds: string[];
    let newPagesAllIds: string[];

    if(pageId === firstPageId) {
      newTweetsAllIds = tweetsAllIds.slice(page.tweets.length);
      newPagesAllIds = pagesAllIds.slice(1)
    } else {
      newTweetsAllIds = tweetsAllIds.slice(0, page.tweets.length * -1);
      newPagesAllIds = pagesAllIds.slice(0, -1)
    }

    delete pagesById[pageId]

    page.tweets.forEach(tweetId => {
      delete tweetsById[tweetId]
    })

    set(() => ({
      tweets: {
        byId: {
          ...tweetsById,
        },
        allIds: [
          ...newTweetsAllIds
        ],
      },
      pages: {
        byId: {
          ...pagesById,
        },
        allIds: [
          ...newPagesAllIds
        ]
      }
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
  getIsShifting: () => {
    return get().isShifting
  },
  setIsShifting: (bol) => {
    set({
      isShifting: bol
    })
  },

  isShifting: false,
}), 'tweets')