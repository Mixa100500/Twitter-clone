'use client'

import sectionS from './Section.module.css'
import diverS from './Diver.module.css'
import {useCheckActive, useSetIsFollowing} from "../../context/NavSection/NavSectionProvider.tsx";

import cn from "classnames";


export const SectionNav = (props) => {
  const { text, isFollowing } = props
  const isActive = useCheckActive(isFollowing)
  const setIsFollowing = useSetIsFollowing()

  const diverCl = cn(
    diverS.diver,
    isActive && diverS.active
  )

  const innerCl = cn(
    sectionS.inner,
    isActive && sectionS.active
  )

  return (
    <button onClick={() => setIsFollowing(isFollowing)} className={sectionS.button}>
      <div className={sectionS.content}>
        <div className={innerCl}>
          {text}
          <div className={diverCl}>
          </div>
        </div>
      </div>
    </button>
  )
}
