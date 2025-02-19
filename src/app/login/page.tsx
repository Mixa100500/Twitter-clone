import pageS from './page.module.css'
import {Login} from "@/feature/auth/Login/Login.tsx";
import {Icon} from "@/components/Icon/Icon.tsx";
import {Suspense} from "react";

export default function page () {
  return <div className={pageS.wrapper}>
    <div className={pageS.container}>
      <Icon name='logo' class={pageS.profile} />
      <div className={pageS.title}>Happening now</div>
      <div className={pageS.text}>join today.</div>
      <Suspense>
        <Login />
      </Suspense>
    </div>
  </div>
}