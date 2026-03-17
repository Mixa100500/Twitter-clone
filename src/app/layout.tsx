import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import './reset.css'
import "./globals.css";
import headerS from './Layout.module.css'
// import headerS from "@/app/home/home.module.css";
import {Icon} from "@/components/Icon/Icon.tsx";
import profile from "@icons/svg/profile.svg";
import logo from "@icons/svg/logo.svg";
import search from "@icons/svg/search.svg";
import home from "@icons/svg/home.svg";
import grok from "@icons/svg/grok.svg";
import bookmark from "@icons/svg/bookmark.svg";
import jobs from "@icons/svg/jobs.svg";
import notification from "@icons/svg/notification.svg";
import message from "@icons/svg/message.svg";
import lightning from "@icons/svg/lightning.svg";
import communities from "@icons/svg/communities.svg";
import dots from "@icons/svg/dots.svg";

const inter = Public_Sans({
  subsets: ["latin"],
  weight: ['400', '700'],
  style: 'normal'
});

export const metadata: Metadata = {
  title: "Twitter",
  description: "Twitter clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/*<ErudaDebug />*/}
      </head>
      <body className={`${inter.className} ${headerS.body}`}>
        <div className={headerS.flex}>
          <div className={headerS.appWrapper}>
            <main className={headerS.main}>
              {children}
            </main>
            <aside className={headerS.menu}>
              <nav className={headerS.center}>
                <ul className={headerS.asideLeft}>
                  <li className={headerS.imgWrapper}>
                    <a className={headerS.navLink} tabIndex={1}>
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
      </body>
    </html>
  );
}

function ErudaDebug () {
  if(process.env.NODE_ENV === 'development') {
    return <>
      {/*<script src="//cdn.jsdelivr.net/npm/eruda"></script>*/}
      { //tslint:disable-next-line
      }
      {/*<script>eruda.init();</script>*/}
    </>
  }
}
