import {createStore} from "@/feature/createStore.ts";
import Hls from "hls.js";
import {throttle} from "@/utils/throttle.ts";

type PlayerState = {
  isPlaying: boolean
  isLoading: boolean
  qualities?: number[]
  currentQuality: number | null
  error: Error | null
  isLive?: boolean
  duration?: number
  ended: boolean
};

type MultiPlayerStore = {
  isMute: boolean,
  needPlayButton: boolean,
  hasUserInteraction: boolean,
  isScrollSubscribed: boolean,
  players: Record<string, PlayerState | undefined>,
  currentPlayerUrl?: string,
  initPlayer: (url: string, container:  HTMLElement) => void;
  destroyPlayer: (url: string) => void;
  play: (url: string) => void;
  pause: (url: string) => void;
  setError: (url: string, error: Error | null) => void;
  setQuality: (url: string, quality: number) => void;
  subscribers: Record<string, true>
  subscribe: (url: string) => void
  unsubscribe: (url: string) => void
  playerPositionCheck: () => void
  getProgress: (url: string) => { progress: number, buffers: BufferRanges, duration: number | undefined, currentTime: number }
  volume: number
  getVideo: () => HTMLVideoElement | undefined
  switchClosesPlayerPositionCheck: (b: boolean) => void
  setVolume: (volume: number) => void
  switchMute: () => void
  getCurrentUrl: () => string | undefined
  switchPlay: (url: string) => void
  isFullScreen: boolean,
  switchFullScreen: (el: HTMLDivElement | null) => void,
};

export type BufferRanges = Array<{
  start: number;
  end: number;
}>

function createPlayer (): HTMLVideoElement {
  console.log('create video')
  const video = document.createElement('video');
  video.setAttribute('playinline', 'true');
  return video
}

function getClosestVideoToCenter(): HTMLElement | null {
  const videoContainers: NodeListOf<HTMLElement> = document.querySelectorAll('.videoContainer');
  if (videoContainers.length === 0) return null;

  const viewportHeight = window.innerHeight;
  const viewportCenter = viewportHeight / 2;
  let closestContainer: HTMLElement | null = null;
  let smallestDistance = Infinity;
  for (const container of videoContainers) {
    const rect = container.getBoundingClientRect();
    const containerTop = rect.top;
    const containerBottom = rect.bottom;
    const containerCenter = (rect.top + rect.bottom) / 2;


    const visibleHeight = Math.min(containerBottom, viewportHeight) - Math.max(containerTop, 0);
    const isVisible = visibleHeight > 50;

    if (isVisible) {
      const distanceToCenter = Math.abs(containerCenter - viewportCenter);
      if (distanceToCenter < smallestDistance) {
        smallestDistance = distanceToCenter;
        closestContainer = container;
      }
    }
  }

  return closestContainer
}

function getDuration (hls: Hls): number | undefined  {
  if (!hls.media) return;
  if (hls.media.buffered.length > 0) {
    return  hls.media.buffered.end(hls.media.buffered.length - 1);
  }
};

interface DocumentWithFullscreen extends Document {
  msExitFullscreen?: () => void;
  mozCancelFullScreen?: () => void;
  webkitExitFullscreen?: () => void;
}

export function exitFullscreen(): void {
  if (!isFullscreen()) return;

  const doc = document as DocumentWithFullscreen;

  if (doc.exitFullscreen) {
    doc.exitFullscreen();
  } else if (doc.msExitFullscreen) {
    doc.msExitFullscreen();
  } else if (doc.mozCancelFullScreen) {
    doc.mozCancelFullScreen();
  } else if (doc.webkitExitFullscreen) {
    doc.webkitExitFullscreen();
  }
}

export function isFullscreen(): boolean {
  return !!(
    document.fullscreenElement ||
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    document.mozFullScreenElement ||
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    document.webkitFullscreenElement ||
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    document.msFullscreenElement
  );
}

interface ExtendedElement {
  ALLOW_KEYBOARD_INPUT: number;
}

interface FullscreenHTMLElement extends HTMLElement {
  msRequestFullscreen?: () => Promise<void>;
  mozRequestFullScreen?: () => Promise<void>;
  webkitRequestFullscreen?: (options?: number) => Promise<void>;
}

export function requestFullscreen(elt: HTMLElement): void {
  const element = elt as FullscreenHTMLElement;
  const LegacyElement = Element as unknown as ExtendedElement;

  if (!isFullscreen()) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen(LegacyElement.ALLOW_KEYBOARD_INPUT);
    }
  }
}

export function addFullscreenListener(listener: () => void): void {
  document.addEventListener("webkitfullscreenchange", listener, false);
  document.addEventListener("mozfullscreenchange", listener, false);
  document.addEventListener("fullscreenchange", listener, false);
  document.addEventListener("MSFullscreenChange", listener, false);
}

export function removeFullscreenListener(listener: () => void): void {
  document.removeEventListener("webkitfullscreenchange", listener, false);
  document.removeEventListener("mozfullscreenchange", listener, false);
  document.removeEventListener("fullscreenchange", listener, false);
  document.removeEventListener("MSFullscreenChange", listener, false);
}

export function createPlayerStore () {
  return createStore<MultiPlayerStore>((set, get) => {

    const hlsMap: Record<string, undefined | Hls> = {};
    let video: HTMLVideoElement | undefined;
    let stopClosesPlayerCheck = false;

    const playerPositionCheck = throttle(() => {
      if(!stopClosesPlayerCheck) {
        const closest = getClosestVideoToCenter();

        const url = closest?.getAttribute('data-player-id');
        if(closest && url) {
          const state = get()
          const prevUrl = state.currentPlayerUrl
          if(url === prevUrl) {
            return;
          }
          state.initPlayer(url, closest)
          return;
        }
      }
    }, 120)

    let eventFullScreenStart = false;

    function switchFullScreenState () {
      const isFull = isFullscreen()
      // debugger;

      if(!isFull && !eventFullScreenStart) {
        fullScreenListen = false
        removeFullscreenListener(switchFullScreenState)
      }
      eventFullScreenStart = false;
      set({
        isFullScreen: isFull
      })
    }

    let fullScreenListen = false;

    return {
      players: {},
      videoElement: undefined,
      isScrollSubscribed: false,
      subscribers: {},
      hasUserInteraction: false,
      isMute: false,
      needPlayButton: false,
      volume: 0,
      isFullScreen: false,
      switchFullScreen(el) {
        const isFull = isFullscreen();
        if(isFull) {
          exitFullscreen();
        } else {
          if(el) {
            requestFullscreen(el)
            if(!fullScreenListen) {
              eventFullScreenStart = true
              addFullscreenListener(switchFullScreenState)
              fullScreenListen = true;
            }
          }
        }
      },
      switchClosesPlayerPositionCheck (value) {
        stopClosesPlayerCheck = value;
      },
      getCurrentUrl () {
        return get().currentPlayerUrl
      },
      switchPlay (url) {
        const state = get()
        const player = state.players[url]
        if(player === undefined) {
          return
        }

        if(url !== state.currentPlayerUrl) {
          return;
        }

        if(player.isPlaying) {
          state.pause(url)
          return;
        }
        state.play(url)
      },
      switchMute () {
        if(!video) {
          return;
        }
        video.muted = !video.muted;

        set({
          isMute: video.muted
        })
      },
      setVolume(value) {
        const result = parseFloat(value.toFixed(2))
        set({
          volume: result
        })
        if(!video) {
          console.error('no video during setVolume')
          return;
        }

        video.volume = result
      },
      playerPositionCheck,
      getVideo () {
        return video
      },
      getProgress (id) {
        const player = get().players[id]
        const isLive = player?.isLive as boolean
        const hls = hlsMap[id]
        let duration: number | undefined

        if(hls) {
          let currentTime = hls.media?.currentTime || 0;
          const buffers: BufferRanges = [];
          const buffered = hls.media?.buffered
          const lengthBuffer = buffered?.length

          if(isLive) {
            duration = getDuration(hls)
          } else {
            duration = hls.media?.duration
          }

          if(lengthBuffer) {
            for (let i = 0; i < lengthBuffer; i++) {
              buffers.push({
                start: Math.round(buffered.start(i)),
                end: Math.round(buffered.end(i)),
              });
            }
          }
          let progress = 0;
          if(duration) {
            progress = Math.round(currentTime / duration * 100)
            if(progress === Infinity) {
              progress = 0;
            }
          }

          if(duration) {
            duration = Math.round(duration)
          }


          currentTime = Math.round(hls.media?.currentTime || 0)
          return { progress, buffers, duration, currentTime }
        }
        return { progress: 0, buffers: [], duration, currentTime: 0 }
      },
      subscribe (url) {
        const state = get()
        const isScrollSubscribed = state.isScrollSubscribed;

        set(state => ({
          subscribers: {
            ...state.subscribers,
            [url]: true,
          },
          isScrollSubscribed: true,
        }))

        state.playerPositionCheck()

        if(!isScrollSubscribed) {
          document.addEventListener("scroll", state.playerPositionCheck)
        }
      },
      unsubscribe (url) {
        set(state => {
          const { [url]: ignoredSub, ...subscribers } = state.subscribers;
          const { [url]: IgnoredPlayer, ...players } = state.players;
          let isScrollSubscribed = state.isScrollSubscribed;
          void ignoredSub;
          void IgnoredPlayer;

          const hls = hlsMap[url]

          if(hls) {
            hls.destroy();
            delete hlsMap[url];
          }

          if(Object.keys(state.subscribers).length === 1) {
            isScrollSubscribed = false;
            playerPositionCheck.cancel()
            document.removeEventListener('scroll', state.playerPositionCheck);
          }

          return {
            subscribers,
            isScrollSubscribed,
            players,
          }
        })
      },
      initPlayer: (url, container) => {
        let hls: Hls;
        set({
          currentPlayerUrl: url
        })

        // canvas placeholder

        if(video) {
          const url = video.parentElement?.getAttribute('data-player-id')

          if(url) {
            const player = hlsMap[url];
            player?.detachMedia();
          }
        } else {
          video = createPlayer();

          video.addEventListener("canplay", () => {
            if(!video) {
              return
            }
            // debugger;

            const url = video.parentElement?.getAttribute('data-player-id')
            if(url) {
              const state = get();
              const playerState = state.players[url];
              if(!playerState) {
                console.error('no such player in state');
                return state;
              }
              if(playerState.ended) {
                state.play(url);
              }

              set({
                players: {
                  ...state.players,
                  [url]: {
                    ...playerState,
                    // isPlaying: true,
                    isLoading: false,
                  }
                }
              })
            }
          });

          video.addEventListener("playing", () => {
            if (!video) {
              return
            }
            const url = video.parentElement?.getAttribute('data-player-id')
            if(url) {
              set(state => {
                const playerState = state.players[url];
                if(!playerState) {
                  console.error('no such player in state');
                  return state;
                }

                if(!playerState.ended) {

                }

                return {
                  players: {
                    ...state.players,
                    [url]: {
                      ...playerState,
                      ended: false,
                    }
                  }
                }
              })
            }
          })

          video.addEventListener("waiting", () => {
            if(!video) {
              return
            }

            const url = video.parentElement?.getAttribute('data-player-id')
            if(url) {
              set(state => {
                const playerState = state.players[url];
                if(!playerState) {
                  console.error('no such player in state');
                  return state;
                }

                return {
                  players: {
                    ...state.players,
                    [url]: {
                      ...playerState,
                      // isPlaying: false,
                      isLoading: true,
                    }
                  }
                }
              })
            }
          })

          video.addEventListener('ended', () => {
            if(!video) {
              return
            }

            const url = video.parentElement?.getAttribute('data-player-id')
            if(url) {
              set(state => {
                const playerState = state.players[url];
                if(!playerState) {
                  console.error('no such player in state');
                  return state;
                }

                return {
                  players: {
                    ...state.players,
                    [url]: {
                      ...playerState,
                      ended: true,
                    }
                  }
                }
              })
            }
          });
          set({
            volume: parseFloat(video.volume.toFixed(2))
          })
        }

        container.prepend(video);

        // const hlsState = state.players[url];
        const hlsInstance = hlsMap[url];
        if(hlsInstance) {
          hls = hlsInstance;
          hls.attachMedia(video);
          hls.once(Hls.Events.MEDIA_ATTACHED, () => {

            if (!video) {
              return
            }

            video.addEventListener('canplay', function handleCanPlay() {
              if (!video) {
                return

              }
              video.removeEventListener('canplay', handleCanPlay);
              get().play(url);
            });
          });
        } else {
          hls = new Hls();
          hls.loadSource(url);
          hls.attachMedia(video);
          hlsMap[url] = hls;

          set((state) => {
            return {
              players: {
                ...state.players,
                [url]: {
                  isPlaying: false,
                  isLoading: true,
                  currentQuality: null,
                  error: null,
                  lastTime: 0,
                  ended: false,
                  // paused: true,
                },
              },
            };
          });

          hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
            const quality: number[] = [];
            let isLive: boolean = false;

            data.levels.forEach(level => {
              quality.push(level.height)
              const live = level.details?.live
              if(isLive === false && live === true) {
                isLive = true;
              }
            });

            get().play(url);

            set(state => {
              const currentPlayer = state.players[url];
              if (!currentPlayer) {
                console.error('no player after manifest parsed');
                return state
              };

              return {
                players: {
                  ...state.players,
                  [url]: {
                    ...currentPlayer,
                    qualities: quality,
                    isLive,
                  }
                }
              };
            });
          });
        }
      },

      destroyPlayer: (url) => {
        set((state) => {
          const hlsInstance = hlsMap[url];

          if (hlsInstance) {
            hlsInstance.destroy();
          }

          const newPlayers = { ...state.players };
          delete newPlayers[url];
          delete hlsMap[url];

          return { players: newPlayers };
        });
      },

      play (url) {
        console.log('play state')
        const state = get()
        const current = state?.currentPlayerUrl
        if(current !== url) {
          return state
        }

        const currentPlayer = state.players[current];
        if (!currentPlayer) {
          console.error('no player during play')
          return state
        }

        if(!video) {
          console.error('no video during play')
        }

        // for typescript
        const newVideoLink: HTMLVideoElement = video || createPlayer();

        if(!video) {
          video = newVideoLink;
        }

        if(currentPlayer.ended) {
          set({
            players: {
              ...state.players,
              [url]: {
                ...currentPlayer,
                ended: false,
              }
            }
          })
        }

        const promise = video?.play()
        if (promise !== undefined) {
          promise.then(() => {
            set((state) => {
              const currentPlayer = state.players[url];
              if(!currentPlayer) {
                console.error('no player during play')
                return state;
              }

              return {
                hasUserInteraction: true,
                needPlayButton: false,
                players: {
                  ...state.players,
                  [url]: {
                    ...currentPlayer,
                    isLoading: false,
                    isPlaying: true,
                    // paused: false,
                  }
                }
              }
            })
          }).catch((error => {
            if (error.name === "NotAllowedError") {
              console.log("maybe need mute...");
              newVideoLink.muted = true;
              set({
                isMute: true
              })

              newVideoLink.play().
                then(() => {
                  set((state) => {
                    const currentPlayer = state.players[url];
                    if(!currentPlayer) {
                      console.error('no player during play with mute')
                      return state;
                    }

                    return {
                      hasUserInteraction: true,
                      players: {
                        ...state.players,
                        [url]: {
                          ...currentPlayer,
                          isPlaying: true,
                          isLoading: false,
                          // paused: false,
                        }
                      }
                    }
                  })
                })
                .catch((error) => {
                  if (error.name === "NotAllowedError") {
                    set({
                      needPlayButton: true
                    })
                  }
                })
            }
          }))
        }
      },

      pause: (url) => {
        if (get().currentPlayerUrl !== url) {
          return
        }
        video?.pause();
        set((state) => {
          const currentPlayer = state.players[url];
          if (!currentPlayer) {
            console.error('no player during pause')
            return state
          };

          return {
            players: {
              ...state.players,
              [url]: {
                ...currentPlayer,
                isPlaying: false,
              },
            },
          }
        });
      },

      setError: (url, error) => {
        set((state) => {
          const currentPlayer = state.players[url];
          if (!currentPlayer) {
            console.error('no player during set Error')
            return state
          };

          return {
            players: {
              ...state.players,
              [url]: {
                ...currentPlayer,
                error,
                isLoading: false,
              },
            },
          }
        });
      },

      setQuality: (url, quality) => {
        set((state) => {
          const player = state.players[url];
          const hlsInstance = hlsMap[url];

          if (!player || !hlsInstance || !player.qualities || !player.qualities.includes(quality)) {
            console.error('set quality before player');
            return state;
          }

          hlsInstance.currentLevel = player.qualities.indexOf(quality);

          return {
            players: {
              ...state.players,
              [url]: {
                ...player,
                currentQuality: quality,
              },
            },
          };
        });
      },
    }
  }, 'player');
}