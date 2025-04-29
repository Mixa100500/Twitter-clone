import {TweetProps} from "@/feature/tweets/types.ts";
import style from "@/feature/tweets/tweets.module.css";
import {Image} from "@/components/Images/Image.tsx";
import {Icon} from "@/components/Icon/Icon.tsx";
import {memo} from "react";
import dots from '@icons/svg/dots.svg';
import repost from '@icons/svg/repost.svg';
import {TweetMedia} from "@/feature/tweets/components/TweetMedia/TweetMedia.tsx";
import {TweetHeader} from "@/feature/tweets/components/TweetHeader/TweetHeade.tsx";
import {RefMedia} from "@/feature/tweets/components/RefMedia/RefMedia.tsx";
import {TweetFooter} from "@/feature/tweets/components/TweetFooter/TweetFooter.tsx";

function TweetWithMemo(props: TweetProps) {
  // todo restore tweetProps
  const {
    tweet,
    refCallback,
    index,
    // top,
  } = props
  const dataTime = tweet.created_at
  const metrics = tweet.public_metrics

  if (tweet.referenced_tweet?.type === "quoted") {
    const quotedIndex = tweet.text.indexOf('https://t.co/')
    const text = tweet.text.slice(0, quotedIndex)
    const refTweet = tweet.referenced_tweet.base
    let refTweetText = refTweet.text;
    const refQuotedIndex = refTweet.text.indexOf('https://t.co/')

    if(refQuotedIndex) {
      refTweetText = refTweet.text.slice(0, refQuotedIndex)
    }

    const referencedAuthor = refTweet.author
    const author = tweet.author
    const referencedDataTime = refTweet.created_at
    return (
      <div className={style.tweet} ref={refCallback} data-index={index}
      >
        <div className={style.flex}>
          <div className={style.profileWrapper}>
            <Image
              alt={tweet.author.username + 'profile picture'}
              class={style.profilePicture}
              src={author.profile_image_url}/>
          </div>
          <article className={style.article}>
            <div className={style.headerContainer}>
              <TweetHeader name={author.name} username={author.username} dataTime={dataTime}/>
              <button>
                <Icon url={dots} class={style.dots}/>
              </button>
            </div>
            <div>
              <div className={style.articleBody}>
                {text}
              </div>
              <TweetMedia marginTop={true} medias={tweet.medias} media_keys={tweet.attachments?.media_keys}/>
              <article className={style.quoted}>
                <div className={style.quotedInner}>
                  <TweetHeader
                    profileImage={referencedAuthor.profile_image_url}
                    name={referencedAuthor.name}
                    username={referencedAuthor.username}
                    dataTime={referencedDataTime}
                  />
                  <div className={style.articleBody}>
                    <div className={style.innerText}>
                      {refTweetText}
                    </div>
                    <button className={style.showMore}>
                      show more
                    </button>
                  </div>
                </div>
                <RefMedia marginTop={true} medias={refTweet.medias} media_keys={refTweet.attachments?.media_keys}/>
              </article>
            </div>
            <TweetFooter metrics={metrics}/>
          </article>
        </div>
      </div>
    )
  }

  if (tweet.referenced_tweet?.type === 'retweeted') {
    const ref = tweet.referenced_tweet.base

    let refTweetText = ref.text;
    const refQuotedIndex = ref.text.indexOf('https://t.co/')

    if(refQuotedIndex) {
      refTweetText = ref.text.slice(0, refQuotedIndex)
    }

    return (
      <div className={style.tweet} ref={refCallback} data-index={index}
      >
        <div className={style.retweetedPined}>
          <div className={style.retweetedPinedLeft}>
            <Icon class={style.retweetedPinedImage} url={repost}/>
          </div>
          <div>{tweet.author.name} reposted</div>
        </div>
        <div className={style.flex}>
          <div className={style.profileWrapper}>
            <Image
              alt={ref.author.username + 'profile picture'}
              class={style.profilePicture}
              src={ref.author.profile_image_url}/>
          </div>
          <article className={style.article}>
            <div className={style.headerContainer}>
              <TweetHeader name={ref.author.name} username={ref.author.username} dataTime={dataTime}/>
              <button>
                <Icon url={dots} class={style.dots}/>
              </button>
            </div>
            <div className={style.articleBody}>
              <div className={style.repostText}>
                {refTweetText}
              </div>
              <button className={style.showMore}>
                show more
              </button>
            </div>
            <RefMedia marginTop={true} media_keys={ref.attachments?.media_keys} medias={ref.medias}/>
            <TweetFooter metrics={ref.public_metrics} />
          </article>
        </div>
      </div>
    )
  }

  const quotedIndex = tweet.text.indexOf('https://t.co/')
  const text = tweet.text.slice(0, quotedIndex)
  const author = tweet.author

  return (
    <div className={style.tweet} ref={refCallback} data-index={index}
    >
      <div className={style.flex}>
        <div className={style.profileWrapper}>
          <Image
            alt={tweet.author.username + 'profile picture'}
            class={style.profilePicture}
            src={author.profile_image_url}/>
        </div>
        <article className={style.article}>
          <div className={style.headerContainer}>
            <TweetHeader name={author.name} username={author.username} dataTime={dataTime}/>
            <button>
              <Icon url={dots} class={style.dots}/>
            </button>
          </div>
          <div>
            <div className={style.articleBody}>
              {text}
            </div>
            <TweetMedia marginTop={text === ''} medias={tweet.medias} media_keys={tweet.attachments?.media_keys} />
          </div>
          <TweetFooter metrics={metrics} />
        </article>
      </div>
    </div>
  )
}

export const Tweet = memo(TweetWithMemo)