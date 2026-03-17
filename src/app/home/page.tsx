import headerS from './home.module.css'
import {SectionNav} from "@/components/SectionNav/SectionNav";
import {Icon} from "@/components/Icon/Icon.tsx";
import './home.css'
import {Suspense} from "react";
import {ButtonByAuth} from "@/feature/auth/ButtonByAuth/ButtonByAuth.tsx";

import logo from '@icons/svg/logo.svg'
import profile from '@icons/svg/profile.svg'
import search from '@icons/svg/search.svg'
import style from "@/feature/tweets/tweets.module.css";
import {Loading} from "@/components/Loading/Loading.tsx";
import {TweetFetchDynamic} from "@/feature/tweets/components/TweetFetchDynamic.tsx";

export default function Home () {
  return (
    <>
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
          <TweetFetchDynamic />
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
    </>
  )
}