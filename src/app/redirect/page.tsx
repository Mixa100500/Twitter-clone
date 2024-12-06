import pageS from "@/app/redirect/page.module.scss";
import {Redirect} from "@/components/Redirect/Redirect.tsx";
import {Suspense} from "react";

export default function page () {
  return (
    <>
      <svg className={pageS.svg} viewBox='0 0 32 32' width='100%' xmlns='http://www.w3.org/2000/svg'>
        <g>
          <circle className={pageS.topCircle} cx='16' cy='16' fill='none' r='14' strokeWidth='4'></circle>
        </g>
        <g className={pageS.animation}>
          <circle className={pageS.bottomCircle} cx='16' cy='16' fill='none' r='14' strokeWidth='4'></circle>
        </g>
      </svg>
      <Suspense>
        <Redirect/>
      </Suspense>
    </>
  )
}