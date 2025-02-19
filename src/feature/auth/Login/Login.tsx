'use client'

import style from "./Login.module.css";
import {loginAction} from "@/feature/auth/Login/loginAction.ts";

export function Login () {
  return (
    <button
      className={style.sign}
      onClick={() => loginAction()}>Sign up with twitter</button>
  )
}