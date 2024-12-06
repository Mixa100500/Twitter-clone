import pageS from './page.module.scss'
import {LogoIcon} from "@/components/LogoIcon/LogoIcon.tsx";
import {Login} from "@/components/Login/Login";
import headerS from "@/app/home/header.module.scss";
import {Icon} from "@/components/Icon/Icon.tsx";

export default function page () {
  return <div className={pageS.wrapper}>
    <div className={pageS.container}>
      <Icon name='logo' class={headerS.profile} />
      <div className={pageS.title}>Happening now</div>
      <div className={pageS.text}>join today.</div>
      <Login />
    </div>
  </div>
}