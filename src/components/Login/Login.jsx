'use client'

import style from "./Login.module.scss";
import {login} from "@/services/login/login.ts";
export const Login = () => {
  return (
    <button
      className={style.sign}
      onClick={() => login()}>Sign up with twitter</button>
  )
}