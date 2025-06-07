'use client'

import {useEffect, useRef} from "react";
import style from './tweets.module.css'
import {Loading} from "@/components/Loading/Loading.tsx";
import {defaultRangeExtractor, useWindowVirtualizer, Range} from "@tanstack/react-virtual";
import {Tweet} from "@/feature/tweets/Tweet.tsx";
import {useTweetStore} from "@/feature/tweets/TweetProvider.tsx";
import {PlayerProvider} from "@/feature/player/PlayerProvider.tsx";

export function Tweets () {
  const useTweets = useTweetStore();
  const tweets = useTweets(state => state.tweets);
  const error = useTweets(state => state.error);
  const request = useTweets(state => state.request);
  const getTokens = useTweets(state => state.getTokens);
  const ids = tweets.allIds;
  const isEmpty = ids.length === 0;
  const parentOffsetRef = useRef(0);
  const visibleRangeRef = useRef([0, 0]);
  const requestRef = useRef(false);
  const overscunRef = useRef(12);
  const firstScanRef = useRef(true);

  const virtualizer = useWindowVirtualizer({
    count: ids.length,
    estimateSize: () => 120,
    overscan: overscunRef.current,
    scrollMargin: parentOffsetRef.current,
    rangeExtractor:
      // useCallback(
      (range: Range) => {
        if(!firstScanRef.current) {
          if(!requestRef.current) {
            const [prevToken, nextToken] = getTokens()
            if((ids.length + 1 < range.endIndex + 4) && nextToken) {
              if(nextToken !== '7140dibdnow9c7btw4b38imlezbszrvesr9qb0kp4agc1') {
                requestRef.current = true
                request(true, nextToken)
                  .finally(() => requestRef.current = false)
              }
            } else if(range.startIndex === 0 && prevToken) {
              requestRef.current = true
              request(false, prevToken)
                .finally(() => {
                  requestRef.current = false
                })
            }
          }
        }
        firstScanRef.current = false;

        visibleRangeRef.current = [range.startIndex, range.endIndex]

        return defaultRangeExtractor(range)
      }
    // }, [ids.length, requestRef.current, nextToken, prevToken]),
  })

  const listRef = useRef<HTMLDivElement | null>(null)

  if (error) {
    return <div>error</div>
  }

  if (isEmpty) {
    return <Loading containerClass={style.loading}/>
  }
  const items = virtualizer.getVirtualItems()

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
            <PlayerProvider>
              {items.map((virtualRow) => {
                const id = tweets.allIds[virtualRow.index]

                return <Tweet
                  key={id}
                  index={virtualRow.index}
                  refCallback={virtualizer.measureElement}
                  tweet={tweets.byId[id]}
                />
              })}
            </PlayerProvider>
            <div className={style.footerSpace}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

