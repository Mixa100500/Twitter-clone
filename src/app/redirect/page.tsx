import {Redirect} from "@/feature/auth/Redirect/Redirect.tsx";
import {Suspense} from "react";
import {Loading} from "@/components/Loading/Loading.tsx";
import style from './page.module.css'

export default function page () {
  return (
    <>
      <Loading containerClass={style.loading} />
      <Suspense>
        <Redirect/>
      </Suspense>
    </>
  )
}