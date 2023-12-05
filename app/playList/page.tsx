'use client'
import { createRoot } from 'react-dom/client'
import videojs from 'video.js';
import React, { useRef, useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import Video from './video'
import { useSwipeable } from 'react-swipeable'
import { videoData, sourceItem } from '../type'

const swipeConfig = {
  delta: 20,                            // min distance(px) before a swipe starts
  preventDefaultTouchmoveEvent: false,  // call e.preventDefault *See Details*
  trackTouch: true,                     // track touch input
  trackMouse: false,                    // track mouse input
  rotationAngle: 0,                     // set a rotation angle
}

export default function Media() {
  const playerRef = useRef(null)
  const containerRef = useRef<HTMLDivElement>()
  const { isLoading, error, data } = useQuery({
    queryKey: ['playList'],
    queryFn: () =>
      fetch('/api/playList').then(
        (res) => res.json(),
      ),
  })
  const [videoData, setVideoData] = useState<sourceItem[]>([])
  const currentRef = useRef(1)

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      const { dir, absY } = eventData
      if (containerRef.current) {
        containerRef.current.style.transition = '0'
        if (dir === 'Up') {
          containerRef.current.style.transform = `translateY(-${absY}px)`
        }

        if (dir === 'Down') {
          containerRef.current.style.transform = `translateY(${absY}px)`
        }

      }

    },
    onSwiped: (eventData) => {
      const { dir, absY } = eventData
      if (containerRef.current) {
        containerRef.current.classList.add('transition',  'duration-300')
        const changePage = absY > 20
        if (changePage) {
          const newData = [...videoData]
          if (dir === 'Up') {
            const firstEl = newData.shift()
            containerRef.current.style.transform = `translateY(-${window.innerHeight}px)`
            if (firstEl) {
              const result = [...newData, firstEl]
              setVideoData(result)
              setTimeout(() => {
                if (containerRef.current) {
                  containerRef.current.classList.remove('transition',  'duration-300')
                  containerRef.current.style.transform = `translateY(0)`
                }
              }, 300);
            }
          }
          if (dir === 'Down') {
            const firstEl = newData.pop()
            containerRef.current.style.transform = `translateY(${window.innerHeight}px)`
            if (firstEl) {
              const result = [firstEl, ...newData]
              setVideoData(result)
              setTimeout(() => {
                if (containerRef.current) {
                  containerRef.current.classList.remove('transition',  'duration-300')
                  containerRef.current.style.transform = `translateY(0)`
                }
              }, 300);
            }
          }
        } else {
          containerRef.current.style.transform = `translateY(0)`
        }
      }
    },
    ...swipeConfig,
  });

  const refPassthrough = (el: any) => {
    handlers.ref(el);

    containerRef.current = el;
  }

  useEffect(() => {
    if (data) {
      setVideoData(data.items)
    }
  }, [data])

  if (isLoading) return <div>Loading...</div>

  if (error) return <div>An error has occurred: </div>

  const videoJsOptions = {
    autoplay: true,
    controls: false,
    responsive: true,
    muted: true,
    fluid: true,
    sources: [{ src: videoData.length > 0 ? videoData[1].play_url : '', type: 'application/x-mpegURL' }]
  };

  const handlePlayerReady = (player: any) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on('waiting', () => {
      videojs.log('player is waiting');
    });

    player.on('dispose', () => {
      videojs.log('player will dispose');
    });
  };

  return videoData.length > 0 ? (
    <div className="w-full h-screen overflow-hidden">
      <div className="w-full h-full overflow-hidden">
        <div className="w-full relative" style={{ top: '-100%' }} {...handlers} ref={refPassthrough}>
          <div className="w-full h-full bg-cover bg-no-repeat" style={{ backgroundImage: `url(${videoData[0].cover})`, height: window.innerHeight }} />
          <div className="w-full h-full bg-cover bg-no-repeat" style={{ backgroundImage: `url(${videoData[1].cover})`, height: window.innerHeight }} >
            <Video options={videoJsOptions} onReady={handlePlayerReady} />
          </div>
          <div className="w-full h-full bg-cover bg-no-repeat" style={{ backgroundImage: `url(${videoData[2].cover})`, height: window.innerHeight }} />
        </div>
      </div>
    </div>
  ) : null
}