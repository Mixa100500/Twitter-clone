import headerS from './home.module.css'
import {SectionNav} from "@/components/SectionNav/SectionNav";
import {Icon} from "@/components/Icon/Icon.tsx";
import './home.css'
import {Suspense} from "react";
import {Tweets} from "@/feature/tweets/Tweets.tsx";
import {ButtonByAuth} from "@/feature/auth/ButtonByAuth/ButtonByAuth.tsx";

export default function Home () {

  return (
    <div className={headerS.flex}>
      <div className={headerS.appWrapper}>
        <main className={headerS.main}>
          <div className={headerS.middle}>
            <div className={headerS.headerTop}>
              <div className={headerS.profileHeaderIcon}>
                <Icon name='profile' class={headerS.profile}/>
              </div>
              <div className={headerS.logoWrapper}>
                <Icon name='logo' class={headerS.logo}/>
                <Suspense>
                  <ButtonByAuth />
                </Suspense>
              </div>
            </div>
            <div className={headerS.section}>
              <SectionNav text='For you' isFollowing={false}/>
              <SectionNav text='Following' isFollowing={true}/>
            </div>
            <Suspense>
              <Tweets />
            </Suspense>
          </div>
          <aside className={headerS.asideRight}>
            <form>
              <label className={headerS.asideRightLabel}>
                <div className={headerS.searchIconWrapper}>
                  <Icon name={'search'} class={headerS.searchLabelSvg}/>
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
                  <Icon name='home' class={headerS.imgSvg}/>
                  <div className={headerS.navText}>Home</div>
                </a>
              </li>
              <li className={headerS.imgWrapper}>
                <a className={headerS.navLink}>
                  <Icon name='search' class={headerS.imgSvg}/>
                  <div className={headerS.navText}>Search</div>
                </a>
              </li>
              <li className={headerS.imgWrapper}>
                <a className={headerS.navLink}>
                  <Icon name='grok' class={headerS.imgSvg}/>
                  <div className={headerS.navText}>Grok</div>
                </a>
              </li>
              <li className={headerS.imgWrapperDesktop}>
                <a className={headerS.navLink}>
                  <Icon name='bookmark' class={headerS.imgSvg}/>
                  <div className={headerS.navText}>Bookmark</div>
                </a>
              </li>
              <li className={headerS.imgWrapperDesktop}>
                <a className={headerS.navLink}>
                  <Icon name='jobs' class={headerS.imgSvg}/>
                  <div className={headerS.navText}>Jobs</div>
                </a>
              </li>
              <li className={headerS.imgWrapperDesktop}>
                <a className={headerS.navLink}>
                  <Icon name='logo' class={headerS.imgSvg}/>
                  <div className={headerS.navText}>Premium</div>
                </a>
              </li>
              <li className={headerS.imgWrapper}>
                <a className={headerS.navLink}>
                  <Icon name='notification' class={headerS.imgSvg}/>
                  <div className={headerS.navText}>Notification</div>
                </a>
              </li>
              <li className={headerS.imgWrapper}>
                <a className={headerS.navLink}>
                  <Icon name='message' class={headerS.imgSvg}/>
                  <div className={headerS.navText}>Message</div>
                </a>
              </li>
              <li className={headerS.imgWrapperDesktop}>
                <a className={headerS.navLink}>
                  <Icon name='lightning' class={headerS.imgSvg}/>
                  <div className={headerS.navText}>Verified Orgs</div>
                </a>
              </li>
              <li className={headerS.imgWrapper}>
                <a className={headerS.navLink}>
                  <Icon name='communities' class={headerS.imgSvg}/>
                  <div className={headerS.navText}>Communities</div>
                </a>
              </li>
              <li className={headerS.imgWrapperDesktop}>
                <a className={headerS.navLink}>
                  <div className={headerS.circleWrapper}>
                    <div className={headerS.circle}>
                      <Icon name='dots' class={headerS.dots}/>
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
            <Icon name='profile' class={headerS.profileDesktop}/>
            <div className={headerS.dostAccountMenu}>
              <Icon name={'dots'} class={headerS.dostAccountMenu} />
            </div>
          </button>
        </aside>
      </div>
    </div>
  )
}