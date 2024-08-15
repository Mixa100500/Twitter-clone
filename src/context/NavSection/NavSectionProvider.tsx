'use client'

import {createContext, ReactNode, useCallback, useContext, useState} from "react";
const followingActiveContext = createContext<boolean | null>(null)
const setIsFollowingContext = createContext<((section: boolean) => void) | null>(null)

interface Props {
  children: ReactNode,
}

export const NavSectionProvider = (props: Props) => {
  const [followingActive, setFollowingActive] = useState(false)

  const setIsFollowing = useCallback((section: boolean) => {
    setFollowingActive(section)
  }, [])

  return <followingActiveContext.Provider value={followingActive}>
    <setIsFollowingContext.Provider value={setIsFollowing}>
      {props.children}
    </setIsFollowingContext.Provider>
  </followingActiveContext.Provider>
}

export const useCheckActive = (isFollowing: boolean) => {
  const isFollowingActive = useContext(followingActiveContext)
  if (isFollowingActive === null) {
    throw new Error('useFollowingActive must be called in the context provider')
  }

  return isFollowingActive === isFollowing;

  // if(isFollowingActive && isFollowing) {
  //   return true
  // }
  // if(isFollowingActive && !isFollowing) {
  //   return false
  // }
  //
  // if(!isFollowingActive && isFollowing) {
  //   return false
  // }
  //
  // if(!isFollowingActive && !isFollowing) {
  //   return true;
  // }
}

export const useSetIsFollowing = () => {
  const setIsFollowing = useContext(setIsFollowingContext)
  if (setIsFollowing === null) {
    throw new Error('useSetIsFollowing must be called in the context provider')
  }
  return setIsFollowing
}

export const useFollowingActive = () => {
  const isActive = useContext(followingActiveContext)
  if (isActive === null) {
    throw new Error('useFollowingActive must be called in the context provider')
  }
  return isActive
}