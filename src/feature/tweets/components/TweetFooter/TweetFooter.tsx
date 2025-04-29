import {TweetMetrics} from "@/feature/tweets/types.ts";
import style from "@/feature/tweets/tweets.module.css";
import {Icon} from "@/components/Icon/Icon.tsx";
import comment from "@icons/svg/comment.svg";
import {formatNumber} from "@/utils/fortmats/formatNumber.ts";
import repost from "@icons/svg/repost.svg";
import like from "@icons/svg/like.svg";
import views from "@icons/svg/views.svg";
import bookmark from "@icons/svg/bookmark.svg";
import share from "@icons/svg/share.svg";

type FooterProps = {
  metrics: TweetMetrics
}

export function TweetFooter (props: FooterProps) {
  const metrics = props.metrics

  return (
    <div className={style.footer}>
      <button className={style.footerButton} aria-label={metrics.reply_count + ' Replies. Reply'}>
        <Icon url={comment} class={style.footerIcon}/>
        {formatNumber(metrics.reply_count)}
      </button>
      <button className={style.footerButton} aria-label={metrics.retweet_count + ' reposts. Repost'}>
        <Icon url={repost} class={style.footerIcon}/>
        {formatNumber(metrics.retweet_count)}
      </button>
      <button className={style.footerButton} aria-label={metrics.like_count + ' Likes. Like'}>
        <Icon url={like} class={style.footerIcon}/>
        {formatNumber(metrics.like_count)}
      </button>
      <button
        className={style.footerButton}
        aria-label={metrics.impression_count + ' views. View post analytics'}
      >
        <Icon url={views} class={style.footerIcon}/>
        {formatNumber(metrics.impression_count)}
      </button>
      <div className={style.footerRight}>
        <button className={style.footerButton} aria-label='Bookmark'>
          <Icon url={bookmark} class={style.footerIcon}/>
        </button>
        <button className={style.footerButton} aria-label='Share post'>
          <Icon url={share} class={style.footerIcon}/>
        </button>
      </div>
    </div>
  )
}