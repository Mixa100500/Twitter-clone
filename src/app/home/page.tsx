import headerS from './header.module.scss'
import {SectionNav} from "@/components/SectionNav/SectionNav";
import {Icon} from "@/components/Icon/Icon.tsx";

export default function Home () {

  return (
    <>
      <header>
        <div className={headerS.header}>
          <div className={headerS.logoWrapper}>
            <Icon name='profile' class={headerS.profile} />
          </div>
          <div className={headerS.logoWrapper}>
            <Icon name='logo' class={headerS.logo} />
          </div>
        </div>
        <div className={headerS.section}>
          <SectionNav text='For you' isFollowing={false}/>
          <SectionNav text='Following' isFollowing={true}/>
        </div>
      </header>
      <aside className={headerS.asideWrapper}>
        <div className={headerS.imgWrapper}>
          <Icon name='home' class={headerS.imgSvg}/>
        </div>
        <div className={headerS.imgWrapper}>
          <Icon name='search' class={headerS.imgSvg}/>
        </div>
        <div className={headerS.imgWrapper}>
          <Icon name='grok' class={headerS.imgSvg}/>
        </div>
        <div className={headerS.imgWrapper}>
          <Icon name='notification' class={headerS.imgSvg}/>
        </div>
        <div className={headerS.imgWrapper}>
          <Icon name='message' class={headerS.imgSvg}/>
        </div>
        <div className={headerS.imgWrapper}>
          <Icon name='people' class={headerS.imgSvg}/>
        </div>
      </aside>

      <main>
      </main>
    </>
  )
}