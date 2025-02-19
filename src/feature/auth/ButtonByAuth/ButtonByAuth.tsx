'use client'

import {getCookie} from "@/utils/cookies/cookies.ts";
import {cookiesMap} from "@/utils/config.ts";
import {loginAction} from "@/feature/auth/Login/loginAction.ts";
import {useEffect, useState} from "react";
import style from './Button.module.css'

export function ButtonByAuth() {
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    const isAuth = getCookie(cookiesMap.authorized);
    if(isAuth !== 'true') {
      setIsAuth(true)
    }
  }, []);

  if(!isAuth) {
    return null
  }

  return (
    <button className={style.button} onClick={() => loginAction()}>
      <div className={style.buttonInner}>sign up</div>
    </button>
  )
}