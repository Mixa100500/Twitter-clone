import headerS from './home.module.css'
import {SectionNav} from "@/components/SectionNav/SectionNav";
import {Icon} from "@/components/Icon/Icon.tsx";
import './home.css'
import {Suspense} from "react";
// import {Tweets} from "@/feature/tweets/Tweets.tsx";
import {ButtonByAuth} from "@/feature/auth/ButtonByAuth/ButtonByAuth.tsx";

// import {
//   bookmark,
//   communities, dots,
//   grok,
//   home,
//   jobs,
//   lightning,
//   logo,
//   message,
//   notification,
//   profile,
//   search
// } from "@/icons";
import bookmark from '@icons/svg/bookmark.svg'
import communities from '@icons/svg/communities.svg'
import dots from '@icons/svg/dots.svg'
import grok from '@icons/svg/grok.svg'
import home from '@icons/svg/home.svg'
import jobs from '@icons/svg/jobs.svg'
import lightning from '@icons/svg/lightning.svg'
import logo from '@icons/svg/logo.svg'
import message from '@icons/svg/message.svg'
import notification from '@icons/svg/notification.svg'
import profile from '@icons/svg/profile.svg'
import search from '@icons/svg/search.svg'
import style from "@/feature/tweets/tweets.module.css";
import {Loading} from "@/components/Loading/Loading.tsx";
import {TweetServer} from "@/feature/tweets/TweetServer.tsx";

export default function Home () {
  return (
    <div className={headerS.flex}>
      <div className={headerS.appWrapper}>
        <main className={headerS.main}>
          <div className={headerS.middle}>
            <div className={headerS.headerTop}>
              <div className={headerS.profileHeaderIcon}>
                <Icon url={profile} class={headerS.profile}/>
              </div>
              <div className={headerS.logoWrapper}>
                <Icon url={logo} class={headerS.logo}/>
                <Suspense>
                  <ButtonByAuth />
                </Suspense>
              </div>
            </div>
            <div className={headerS.section}>
              <SectionNav text='For you' isFollowing={false}/>
              <SectionNav text='Following' isFollowing={true}/>
            </div>
            <Suspense fallback={<Loading containerClass={style.loading}/>}>
              <TweetServer />
            </Suspense>
          </div>
          <aside className={headerS.asideRight}>
            <form>
              <label className={headerS.asideRightLabel}>
                <div className={headerS.searchIconWrapper}>
                  <Icon url={search} class={headerS.searchLabelSvg}/>
                </div>
                <input className={headerS.searchInput}/>
              </label>
            </form>
          </aside>
        </main>
        <aside className={headerS.menu}>
          <nav>
            <ul className={headerS.asideLeft}>
              <li className={headerS.imgWrapper}>
                <a className={headerS.navLink}>
                  <Icon url={home} class={headerS.imgSvg}/>
                  <div className={headerS.navText}>Home</div>
                </a>
              </li>
              <li className={headerS.imgWrapper}>
                <a className={headerS.navLink}>
                  <Icon url={search} class={headerS.imgSvg}/>
                  <div className={headerS.navText}>Search</div>
                </a>
              </li>
              <li className={headerS.imgWrapper}>
                <a className={headerS.navLink}>
                  <Icon url={grok} class={headerS.imgSvg}/>
                  <div className={headerS.navText}>Grok</div>
                </a>
              </li>
              <li className={headerS.imgWrapperDesktop}>
                <a className={headerS.navLink}>
                  <Icon url={bookmark} class={headerS.imgSvg}/>
                  <div className={headerS.navText}>Bookmark</div>
                </a>
              </li>
              <li className={headerS.imgWrapperDesktop}>
                <a className={headerS.navLink}>
                  <Icon url={jobs} class={headerS.imgSvg}/>
                  <div className={headerS.navText}>Jobs</div>
                </a>
              </li>
              <li className={headerS.imgWrapperDesktop}>
                <a className={headerS.navLink}>
                  <Icon url={logo} class={headerS.imgSvg}/>
                  <div className={headerS.navText}>Premium</div>
                </a>
              </li>
              <li className={headerS.imgWrapper}>
                <a className={headerS.navLink}>
                  <Icon url={notification} class={headerS.imgSvg}/>
                  <div className={headerS.navText}>Notification</div>
                </a>
              </li>
              <li className={headerS.imgWrapper}>
                <a className={headerS.navLink}>
                  <Icon url={message} class={headerS.imgSvg}/>
                  <div className={headerS.navText}>Message</div>
                </a>
              </li>
              <li className={headerS.imgWrapperDesktop}>
                <a className={headerS.navLink}>
                  <Icon url={lightning} class={headerS.imgSvg}/>
                  <div className={headerS.navText}>Verified Orgs</div>
                </a>
              </li>
              <li className={headerS.imgWrapper}>
                <a className={headerS.navLink}>
                  <Icon url={communities} class={headerS.imgSvg}/>
                  <div className={headerS.navText}>Communities</div>
                </a>
              </li>
              <li className={headerS.imgWrapperDesktop}>
                <a className={headerS.navLink}>
                  <div className={headerS.circleWrapper}>
                    <div className={headerS.circle}>
                      <Icon url={dots} class={headerS.dots}/>
                    </div>
                  </div>
                  <div className={headerS.navText}>More</div>
                </a>
              </li>
              <li className={headerS.postLinkWrapper}>
                <a className={headerS.postLink}>
                  Post
                </a>
              </li>
            </ul>
          </nav>
          <button className={headerS.accountMenu}>
            <Icon url={profile} class={headerS.profileDesktop}/>
            <div className={headerS.dostAccountMenu}>
              <Icon url={dots} class={headerS.dostAccountMenu} />
            </div>
          </button>
        </aside>
      </div>
    </div>
  )
}