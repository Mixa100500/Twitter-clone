export type TweetMetrics = {
  retweet_count: number;
  reply_count: number;
  like_count: number;
  quote_count: number;
  bookmark_count: number;
  impression_count: number;
};

type TweetEntityMention = {
  start: number;
  end: number;
  username: string;
  id: string;
};

type TweetEntities = {
  mentions?: TweetEntityMention[];
};

export type TweetAttachments = {
  media_keys?: string[];
};

type TweetBase = {
  public_metrics: TweetMetrics;
  edit_history_tweet_ids: string[];
  created_at: string;
  id: string;
  author_id: string;
  text: string;
  // referenced_tweets?: ReferencedTweet[];
  attachments?: TweetAttachments;
  entities?: TweetEntities;
}

type TweetWithAuthor = TweetBase & {
  author: UserProfile,
}

export type TweetUnresolved = TweetBase & {
  referenced_tweets?: Array<{
    type: "retweeted" | "quoted" | "replied_to";
    id: string;
  }>;
}

export type ReferencedTweet = {
  type: "retweeted" | "quoted" | "replied_to";
  id: string;
  base: InnerReferencedTweet;
}

export type InnerReferencedTweet = TweetWithAuthor & {
  referenced_tweet?: {
    type: "retweeted" | "quoted" | "replied_to";
    id: string;
  }
  medias?: Media[];
}

export type Tweet = TweetWithAuthor & {
  referenced_tweet?: ReferencedTweet;
  medias?: Media[];
  pageId: string,
}

// users

type UrlEntity = {
  start: number;
  end: number;
  url: string;
  expanded_url: string;
  display_url: string;
};

type UserEntities = {
  url?: {
    urls: UrlEntity[];
  };
  description?: {
    urls?: UrlEntity[];
    mentions?: Array<{
      "start": number,
      "end": number,
      "username": string
    }>
    cashtags?: [
      {
        "start": number,
        "end": number,
        "tag": string,
      }
    ]
  };
};

export type UserProfile = {
  entities?: UserEntities;
  name: string;
  profile_image_url: string;
  username: string;
  id: string;
};

export type Variants = Array<{
  bit_rate?: number,
  content_type: "application/x-mpegURL" | "video/mp4",
  url: string
}>

export type Media = {
  media_key: string,
  type: 'photo' | 'video',
  url?: string,
  variants?: Variants
  preview_image_url?: string,
}

export type Meta = {
  result_count: number,
  newest_id: string,
  oldest_id: string,
  next_token?: string,
  previous_token?: string,
}

export type TweetLineUnresolved = {
  data: TweetUnresolved[],
  includes: {
    users: UserProfile[],
    tweets: TweetUnresolved[],
    media?: Media[],
  },
  meta: Meta
};

export type TweetLineNormalized = {
  tweets: Tweet[];
  // mediaByKey: MediaByKey;
  meta: Meta;
  refIds: string;
};

export type Medias = Media[]

export type MediaByKey = Record<string, Media>

export type TweetProps = {
  index: number
  tweet: Tweet,
  // mediaByKey: MediaByKey;
  refCallback: (node: (Element | null | undefined)) => void,
  // top?: fortmats | null,
}