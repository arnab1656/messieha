import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);
  const [isCursorMoving, setIsCursorMoving] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const nextVideoRef = useRef<HTMLVideoElement>(null);
  const cursorTimeoutRef = useRef<number | null>(null);
  const videoLimit = 4;

  const getVideoSrc = (index: number) => `/videos/hero-${index}.mp4`;

  // Get next index (wrap around)
  const getNextIndex = (current: number) => {
    return current === videoLimit ? 1 : current + 1;
  };

  const handleVideoClick = () => {
    setCurrentIndex(getNextIndex(currentIndex));
  };

  const handleNextVideoLoaded = () => {};

  // Handle cursor movement
  const handleMouseMove = (e: React.MouseEvent) => {
    setCursorPosition({ x: e.clientX, y: e.clientY });
    setIsCursorMoving(true);

    // Clear existing timeout
    if (cursorTimeoutRef.current) {
      clearTimeout(cursorTimeoutRef.current);
    }

    cursorTimeoutRef.current = window.setTimeout(() => {
      setIsCursorMoving(false);
    }, 100);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (cursorTimeoutRef.current) {
        clearTimeout(cursorTimeoutRef.current);
      }
    };
  }, []);

  gsap.registerPlugin(ScrollTrigger);

  // Animation for next video lens shape
  useGSAP(
    () => {
      if (isCursorMoving) {
        gsap.to(`#hero__item__content-${getNextIndex(currentIndex)}`, {
          clipPath: 'polygon(25% 25%, 75% 25%, 75% 75%, 25% 75%)',
          duration: 0.5,
          ease: 'power2.out',
        });
      } else {
        gsap.to(`#hero__item__content-${getNextIndex(currentIndex)}`, {
          clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)',
          duration: 0.3,
          ease: 'power2.in',
        });
      }
    },
    { dependencies: [isCursorMoving, currentIndex] }
  );

  useGSAP(() => {
    gsap.set('#hero__item__content', {
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
      borderRadius: '0% 0% 0% 0%',
    });
    gsap.to('#hero__item__content', {
      clipPath: 'polygon(34% 1%, 64% 1%, 76% 71%, 12% 44%)',
      borderRadius: '0% 0% 0% 0%',
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: '#hero__item__content',
        start: 'center center',
        end: 'bottom top',
        scrub: true,
      },
    });
  });

  return (
    <section className="relative h-dvh w-screen" onMouseMove={handleMouseMove}>
      <div
        id="hero__slides"
        className="absolute top-0 left-0 z-1 h-full w-full bg-amber-300 opacity-100 text-8xl"
      >
        <div
          id="hit__area"
          className="absolute top-1/2 left-1/2 cursor-pointer h-1/5 w-1/5 bg-amber-700 opacity-[0.5] transform -translate-x-1/2 -translate-y-1/2 z-100 max-md:top-[60%] max-md:w-1/2 md:w-1/5"
          onClick={handleVideoClick}
        ></div>

        {/* Cursor movement indicator */}
        <div className="absolute top-4 right-4 z-50 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
          Cursor: {isCursorMoving ? 'MOVING' : 'STILL'}
        </div>
        {[1, 2, 3, 4].map((videoIndex) => {
          const isCurrent = videoIndex === currentIndex;
          const isNext = videoIndex === getNextIndex(currentIndex);

          let zIndex = 0;
          let display = 'none';

          if (isCurrent) {
            zIndex = 1;
            display = 'block';
          } else if (isNext) {
            zIndex = 2;
            display = 'block';
          }

          return (
            <div
              key={videoIndex}
              id={`heroItem-${videoIndex}`}
              className="absolute h-full w-full top-0 left-0"
              style={{
                zIndex: zIndex,
                display: display,
              }}
            >
              <div
                id={
                  isCurrent
                    ? 'hero__item__content'
                    : `hero__item__content-${videoIndex}`
                }
                className="bg-[#5542ff] absolute top-0 left-0 h-full w-full"
                style={{
                  clipPath: isCurrent
                    ? 'polygon(0 0, 100% 0%, 100% 100%, 0% 100%)'
                    : // : 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)',
                      'polygon(25% 25%, 75% 25%, 75% 75%, 25% 75%)',
                }}
              >
                <div
                  id="hero__item__innerWrapper"
                  className="absolute top-0 left-0 overflow-hidden opacity-100 visible transform translate-x-0 translate-y-0 scale-100 h-full w-full"
                >
                  {/* Debug info - remove later */}
                  <div className="absolute top-4 left-4 z-10 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                    {isCurrent ? 'CURRENT' : isNext ? 'NEXT' : 'HIDDEN'} - Video{' '}
                    {videoIndex}{' '}
                    {isNext && `(${isCursorMoving ? 'MOVING' : 'STILL'})`}
                  </div>
                  <video
                    src={getVideoSrc(videoIndex)}
                    autoPlay
                    muted
                    loop
                    className="h-full w-full absolute top-0 left-0 object-cover scale-[1.4]"
                  ></video>
                </div>
                <svg
                  viewBox="0 0 850 610"
                  fill="none"
                  stroke="#000000"
                  strokeWidth={2}
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ width: '100%', height: 'auto' }}
                >
                  <path
                    d="M838,-3
     L838,-3
     Q846,-3 846,5
     L846,601
     Q846,609 838,609
     L5,609
     Q-3,609 -3,601
     L-3,5
     Q-3,-3 5,-3
     Z"
                  />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Hero;
