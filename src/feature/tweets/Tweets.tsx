'use client'

import {useEffect, useLayoutEffect, useRef} from "react";
import style from './tweets.module.css'
import {Loading} from "@/components/Loading/Loading.tsx";

import {useTweets} from "@/feature/tweets/store.ts";
import {defaultRangeExtractor, useWindowVirtualizer, Range} from "@tanstack/react-virtual";
import {useScroll} from "@/feature/tweets/scrollStore.ts";
import {Tweet} from "@/feature/tweets/Tweet.tsx";

function getTopVisibleElement(container: HTMLElement): [number | null, string | null] {
  const arrayChildren = Array.from(container.children) as HTMLElement[];
  let top;
  let key;
  let isFirstNegative = false;

  for (const child of arrayChildren) {
    const current = child.getBoundingClientRect().top;
    if(top === undefined) {
      if(current < 0) {
        isFirstNegative = true;
      }
      top = current;
      key = child.getAttribute('data-id');
      if(current >= 0) {
        break;
      }
    } else {
      if(isFirstNegative && current > 0) {
        break;
      }
      if(current > 0) {
        break;
      }
      top = current
      key = child.getAttribute('data-id');
    }

  }

  if(key === undefined) {
    key = null;
  }

  if(top === undefined) {
    top = null;
  }

  return [top, key]
}

export function Tweets () {
  const {
    tweets,
    error,
    request,
    getTokens,
    getIsShifting,
    setIsShifting,
  } = useTweets(state => state);
  const isShifting = getIsShifting();
  // const [prevToken, nextToken] = getTokens()
  const ids = tweets.allIds
  const isEmpty = ids.length === 0
  const parentOffsetRef = useRef(0)
  const visibleRangeRef = useRef([0, 0]);
  const requestRef = useRef(false)
  const setTop = useScroll(state => state.setTop)
  const overscunRef = useRef(3)

  const virtualizer = useWindowVirtualizer({
    count: ids.length,
    estimateSize: () => 120,
    overscan: overscunRef.current,
    scrollMargin: parentOffsetRef.current,
    rangeExtractor:
      // useCallback(
      (range: Range) => {
        if(refRange.current) {
          // console.log([range.startIndex, range.endIndex])
          if(!requestRef.current) {
            const [prevToken, nextToken] = getTokens()
            if((ids.length + 1 < range.endIndex + 4) && nextToken) {
              // if(nextToken !== '7140dibdnow9c7btw4b38imlezbszrvesr9qb0kp4agc1') {
              requestRef.current = true
              request(true, nextToken)
                .finally(() => requestRef.current = false)
              // }
            } else if(range.startIndex === 0 && prevToken) {
              requestRef.current = true
              request(false, prevToken)
                .finally(() => {
                  requestRef.current = false
                })
            }
          }
        }

        visibleRangeRef.current = [range.startIndex, range.endIndex]

        return defaultRangeExtractor(range)
      }
    // }, [ids.length, requestRef.current, nextToken, prevToken]),
  })
  console.log('component')
  const shiftDelay = useRef(false);
  // const isShiftingRef = useRef(false);
  const waiteRef = useRef(false);

  useLayoutEffect(() => {
    if(getIsShifting() && !shiftDelay.current) {
      console.log('shift', )
      // debugger;
      shiftDelay.current = true;
      const anchor = document.getElementById('anchor')
      waiteRef.current = false;
      anchor?.scrollIntoView(true);
      setTimeout(() => {
        anchor?.scrollIntoView(true);
        setTimeout(() => {
          setIsShifting(false);
          shiftDelay.current = false;
        }, 0);
      }, 0);
    }
  }, [isShifting])

  useEffect(() => {
    document.addEventListener('scroll', getTopElement)

    return () => {
      document.removeEventListener('scroll', getTopElement)
    }
  }, [])

  const listRef = useRef<HTMLDivElement | null>(null)

  function getTopElement() {
    if(listRef.current && !getIsShifting()) {
      const [top, key] = getTopVisibleElement(listRef.current);

      console.log('top', top, key);
      setTop(top, key)
    }
  }

  const refRange = useRef(false)
  useEffect(() => {
    if(ids.length > 8) {
      refRange.current = true
    }
  }, [ids.length])

  useEffect(() => {
    request(true)
      .then(() => overscunRef.current = 12)
  }, []);

  if (error) {
    return <div>error</div>
  }

  if (isEmpty) {
    return <Loading containerClass={style.loading}/>
  }
  const items = virtualizer.getVirtualItems()
  console.log(items.length)
  return (
    <div className={style.timeline}>
      <div className={style.page}>
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          <div
            ref={listRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${items[0]?.start ?? 0}px)`,
            }}
          >
            {items.map((virtualRow) => {
              const id = tweets.allIds[virtualRow.index]

              return <Tweet
                key={id}
                index={virtualRow.index}
                refCallback={virtualizer.measureElement}
                tweet={tweets.byId[id]}
              />
            })}
            <div className={style.footerSpace}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

