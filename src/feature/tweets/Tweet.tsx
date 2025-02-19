import {Media, Medias, TweetAttachments, TweetMetrics, TweetProps} from "@/feature/tweets/types.ts";
import {useTweets} from "@/feature/tweets/store.ts";
import {useScroll} from "@/feature/tweets/scrollStore.ts";
import style from "@/feature/tweets/tweets.module.css";
import {Image} from "@/components/Images/Image.tsx";
import {Icon} from "@/components/Icon/Icon.tsx";
import {formatNumber} from "@/utils/fortmats/formatNumber.ts";
import classNames from "classnames";
import {Player} from "@/components/Player/Player.tsx";
import {formatDateToShort} from "@/utils/fortmats/formatData.ts";
import {memo, useEffect} from "react";

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
  const subscribe = useTweets(state => state.subscribe)
  const unsubscribe = useTweets(state => state.unsubscribe)
  const render = useScroll(state => state.topElementId === tweet.id)

  let topScrollAnchor;

  if(render) {
    topScrollAnchor = <Anchor />
  }

  useEffect(() => {
    subscribe(tweet.pageId)
    return () => {
      // debugger;
      unsubscribe(tweet.pageId)
    }
  }, [])

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
      <div className={style.tweet} data-id={tweet.id} ref={refCallback} data-index={index}
      >
        {topScrollAnchor}
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
                <Icon name='dots' class={style.dots}/>
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
                <RefMedia medias={refTweet.medias} media_keys={refTweet.attachments?.media_keys}/>
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
      <div className={style.tweet} data-id={tweet.id} ref={refCallback} data-index={index}
      >
        {topScrollAnchor}
        <div className={style.retweetedPined}>
          <div className={style.retweetedPinedLeft}>
            <Icon class={style.retweetedPinedImage} name={'repost'}/>
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
                <Icon name='dots' class={style.dots}/>
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
    <div className={style.tweet} data-id={tweet.id} ref={refCallback} data-index={index}
    >
      {topScrollAnchor}
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
              <Icon name='dots' class={style.dots}/>
            </button>
          </div>
          <div>
            <div className={style.articleBody}>
              {text}
            </div>
            <TweetMedia marginTop={true} medias={tweet.medias} media_keys={tweet.attachments?.media_keys} />
          </div>
          <TweetFooter metrics={metrics} />
        </article>
      </div>
    </div>
  )
}


type FooterProps = {
  metrics: TweetMetrics
}

function TweetFooter (props: FooterProps) {
  const metrics = props.metrics

  return (
    <div className={style.footer}>
      <button className={style.footerButton} aria-label={metrics.reply_count + ' Replies. Reply'}>
        <Icon name='comment' class={style.footerIcon}/>
        {formatNumber(metrics.reply_count)}
      </button>
      <button className={style.footerButton} aria-label={metrics.retweet_count + ' reposts. Repost'}>
        <Icon name='repost' class={style.footerIcon}/>
        {formatNumber(metrics.retweet_count)}
      </button>
      <button className={style.footerButton} aria-label={metrics.like_count + ' Likes. Like'}>
        <Icon name='like' class={style.footerIcon}/>
        {formatNumber(metrics.like_count)}
      </button>
      <button
        className={style.footerButton}
        aria-label={metrics.impression_count + ' views. View post analytics'}
      >
        <Icon name='views' class={style.footerIcon}/>
        {formatNumber(metrics.impression_count)}
      </button>
      <div className={style.footerRight}>
        <button className={style.footerButton} aria-label='Bookmark'>
          <Icon name='bookmark' class={style.footerIcon}/>
        </button>
        <button className={style.footerButton} aria-label='Share post'>
          <Icon name='share' class={style.footerIcon}/>
        </button>
      </div>
    </div>
  )
}


type RefMediaProps = TweetAttachments & {
  marginTop?: boolean,
  medias?: Media[],
}

function RefMedia(props: RefMediaProps) {
  const { media_keys, medias, marginTop } = props

  if (!media_keys) {
    // no image
    return null
  }

  const notReady = () => {
    const isSingle = media_keys.length === 1

    if (isSingle) {
      const className = classNames(
        style.orange,
        'placeholder',
        marginTop && style.marginTop
      )
      return <div className={className}></div>
    }

    const className = classNames(
      style.fewImageContainer,
      marginTop && style.marginTop
    )

    return <div className={className}>
      <Image alt="Image" class={style.manyImage}/>
      <Image alt="Image" class={style.manyImage}/>
    </div>
  }

  if (!medias) {
    return notReady()
  }

  if(medias.length === 0) {
    return notReady()
  }

  return <ReadyMedia marginTop={marginTop} medias={medias} />
}


type ReadyMediaProps = {
  medias: Medias
  marginTop?: boolean
}

function ReadyMedia (props: ReadyMediaProps) {
  const { medias, marginTop } = props
  if(medias[0].type === 'photo') {

    if(medias.length === 1) {
      const media = medias[0]
      const url = media.url?.slice(0, -4)
      const classname = classNames(
        style.oneImage,
        marginTop && style.marginTop
      )

      return <div className={style.oneImageContainer}><Image
        class={classname}
        srcSet={`
          ${url}?format=jpg&name=240x240 240w, 
          ${url}?format=jpg&name=360x360 360w, 
          ${url}?format=jpg&name=small 480w`}

        sizes="(max-width: 300px) 240px,(max-width: 420px) 360px,480px"
        key={media.media_key}
        src={media.url}
        alt="Image"
        loading='lazy'
      /></div>
    }

    const classname = classNames(
      style.fewImageContainer,
      marginTop && style.marginTop
    )

    return <div className={classname}>
      {medias.map(media => {
        const url = media.url?.slice(0, -4);
        const isPhoto = media.type === 'photo';
        const isVideo = media.type === 'video';

        if(isPhoto) {
          return (
            <Image
              class={style.manyImage}
              srcSet={`
              ${url}?format=jpg&name=240x240 240w,
              ${url}?format=jpg&name=360x360 360w`
              }

              sizes="(max-width: 540px) 240px,360px"
              src={media.url}
              alt="Image"
              key={media.media_key}
              loading='lazy'
            />
          )
        }

        if(isVideo) {
          const variants = media.variants
          return (
            <Player key={media.media_key} class={style.manyImage} variants={variants}/>
          )
        }
      })}
    </div>
  }

  const variants = medias[0].variants
  const classname = classNames(
    style.oneVideo,
    marginTop && style.tweetPlayer
  )

  return (
    <Player class={classname} variants={variants} />
  )
}


type TweetMediaProps = TweetAttachments & {
  marginTop?: boolean
  medias?: Media[],
}

function TweetMedia (props: TweetMediaProps) {
  const { medias, marginTop } = props

  if(!medias) {
    return null
  }

  return <ReadyMedia marginTop={marginTop} medias={medias} />
}

type HeaderProps = {
  name: string,
  username: string,
  dataTime: string,
  profileImage?: string,
}

function TweetHeader (props: HeaderProps) {
  const { name, username, dataTime, profileImage } = props;
  const data = formatDateToShort(dataTime)

  return (
    <div className={style.header}>
      {profileImage && <Image alt={'profile picture'} class={style.innerProfilePicture} src={profileImage} />}
      <div className={style.headerLeft}>
        <span className={style.name}>{name}</span>
        <Icon name='checkMark' class={style.checkMark}/>
      </div>
      <div className={style.headerMiddle}>
        <span className={style.username}>
          @{username}
        </span>
        <span className={style.dot}>
          ·
        </span>
        <time className={style.time} dateTime={dataTime}>
          {data}
        </time>
      </div>
    </div>
  )
}

export const Tweet = memo(TweetWithMemo)

function Anchor () {
  const top = useScroll(state => state.top)
  if(top === null) {
    return null
  }

  return <div id='anchor' style={{top: top * -1, position: 'absolute'}}>
  </div>
}