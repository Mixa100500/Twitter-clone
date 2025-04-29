import {
  InnerReferencedTweet,
  Media, MediaByKey, MediaWithHls,
  Tweet,
  TweetLineNormalized,
  TweetLineUnresolved,
  TweetUnresolved,
  UserProfile
} from "@/feature/tweets/types.ts";
import {ResultMedia} from "@/app/api/media/[ids]/results.ts";

export function normalizeTweets(data: TweetLineUnresolved): TweetLineNormalized {
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
      const hlsUrl = media.variants?.find(e => e.content_type === 'application/x-mpegURL')?.url

      const mediaWithHls: MediaWithHls = {
        ...media,
        hlsUrl,
      }
      // mediaByKey[media.media_key] = media;
      mediaByKey[media.media_key] = mediaWithHls;
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

export function normalizeTweetsMedia (input: ResultMedia): MediaByKey {
  const mediaById: MediaByKey = {}

  input.includes.media.forEach(media => {
    const hlsUrl = media.variants?.find(e => e.content_type === 'application/x-mpegURL')?.url

    const mediaWithHls: MediaWithHls = {
      ...media,
      hlsUrl,
    }

    const id = media.media_key.slice(2);
    mediaById[id] = mediaWithHls
  })
  return mediaById
}