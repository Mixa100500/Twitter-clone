'use client'
import {useEffect} from "react";
import {authByCode} from "@/services/redirect/redirect.ts";
import {useRouter, useSearchParams} from "next/navigation";

export function Redirect () {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    if(state === null && code === null) {
      router.push('/login')
      return
    }

    authByCode(code, state)
  }, [router, searchParams]);
  return null
}