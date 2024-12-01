import pageS from './page.module.scss'
import {LogoIcon} from "@/components/LogoIcon/LogoIcon.tsx";
import {Login} from "@/components/Login/Login";

export default function page () {
  return <div className={pageS.wrapper}>
    <div className={pageS.container}>
      <LogoIcon classname={pageS.logo}/>
      <div className={pageS.title}>Happening now</div>
      <div className={pageS.text}>join today.</div>
      <Login />
    </div>
  </div>
}