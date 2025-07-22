import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MonitorBox from './monitorBox';

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isCursorMoving, setIsCursorMoving] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isInHitArea, setIsInHitArea] = useState(false);

  const cursorTimeoutRef = useRef<number | null>(null);
  const lastCursorPositionRef = useRef({ x: 0, y: 0 });
  const totalDistanceRef = useRef(0);
  const nextElementRef = useRef<HTMLDivElement | null>(null);
  const [isNextVisible, setIsNextVisible] = useState(false);

  const isAnimating = useRef(false);

  const videoLimit = 4;

  const getVideoSrc = (index: number) => `/videos/hero-${index}.mp4`;

  const getNextIndex = (current: number) => {
    return current === videoLimit ? 1 : current + 1;
  };

  // Calculate polygon based on cursor distance
  const getPolygonFromDistance = (distance: number) => {
    const maxDistance = 50;
    const progress = Math.min(distance / maxDistance, 1);

    // Start: polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%) - dot
    // End: polygon(25% 25%, 75% 25%, 75% 75%, 25% 75%) - square

    const startPercent = 50;
    const endPercent = 25;
    const currentPercent =
      startPercent - progress * (startPercent - endPercent);

    return `polygon(${currentPercent}% ${currentPercent}%, ${100 - currentPercent}% ${currentPercent}%, ${100 - currentPercent}% ${100 - currentPercent}%, ${currentPercent}% ${100 - currentPercent}%)`;
  };

  const handleVideoClick = () => {
    // setCurrentIndex(getNextIndex(currentIndex));

    const nextIndex = getNextIndex(currentIndex);
    const nextElement = document.getElementById(
      `hero__item__content-${nextIndex}`
    );

    if (nextElement) {
      // Get the computed style instead of inline style
      const computedStyle = window.getComputedStyle(nextElement);
      const currentClipPath = computedStyle.clipPath;

      console.log('nextElement is ', nextElement);
      console.log('currentClipPath is ', currentClipPath);

      if (currentClipPath !== 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)') {
        isAnimating.current = true;

        // Animate to full screen
        gsap.killTweensOf(`#hero__item__content-${nextIndex}`, 'clipPath');

        gsap.set(`#heroItem-${nextIndex}`, {
          zIndex: 1,
        });

        gsap.to(`#hero__item__content-${nextIndex}`, {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          ease: 'power1.inOut',
          duration: 2.5,
          onComplete: () => {
            console.log('the clippath change is completed', currentClipPath);
            // gsap.set(`#hero__item__content`, { display: 'none' });

            gsap.set(`#heroItem-${currentIndex}`, {
              zIndex: 0,
              display: 'none',
            });

            gsap.set(`#heroItem-${getNextIndex(currentIndex)}`, {
              zIndex: 1,
            });

            isAnimating.current = false;
          },
        });

        gsap.to(
          `#hero__item__content-${nextIndex} > #hero__item__innerWrapper`,
          {
            scale: 1,
            ease: 'power1.inOut',
            duration: 2.5,
            onComplete: () => {},
          }
        );

        // Animate the next to next video from dot to  square

        const nextToNextIndex = getNextIndex(nextIndex);

        gsap.set(`#heroItem-${nextToNextIndex}`, {
          zIndex: 2,
          display: 'block',
        });

        gsap.to(`#hero__item__content-${nextToNextIndex}`, {
          clipPath: 'polygon(25% 25%, 75% 25%, 75% 75%, 25% 75%)',
          ease: 'power1.inOut',
          duration: 2.5,
          onComplete: () => {
            console.log('the next to next video is now visible');
          },
        });
      } else {
        isAnimating.current = true;

        // Animate the next video to square
        gsap.to(`#hero__item__content-${nextIndex}`, {
          clipPath: 'polygon(25% 25%, 75% 25%, 75% 75%, 25% 75%)',
          ease: 'power1.inOut',
          duration: 2.5,
          onComplete: () => {
            // gsap.set(`#hero__item__content`, { display: 'block' });

            gsap.set(`#heroItem-${currentIndex}`, {
              zIndex: 1,
              display: 'block',
            });
            isAnimating.current = false;
          },
        });
        gsap.to(
          `#hero__item__content-${nextIndex} > #hero__item__innerWrapper`,
          {
            scale: 0.8,
            ease: 'power1.inOut',
            duration: 2.5,
            onComplete: () => {},
          }
        );
      }
    } else {
      alert(`Element not found for index ${nextIndex}`);
    }
  };

  // Handle cursor movement
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isAnimating.current) return;

    const currentX = e.clientX;
    const currentY = e.clientY;

    setCursorPosition({ x: currentX, y: currentY });

    if (
      lastCursorPositionRef.current.x !== 0 ||
      lastCursorPositionRef.current.y !== 0
    ) {
      const deltaX = currentX - lastCursorPositionRef.current.x;
      const deltaY = currentY - lastCursorPositionRef.current.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      totalDistanceRef.current += distance;
    }

    lastCursorPositionRef.current = { x: currentX, y: currentY };

    const nextElement = document.getElementById(
      `heroItem-${getNextIndex(currentIndex)}`
    );

    if (nextElement) {
      if (isInHitArea) {
        gsap.killTweensOf(nextElementRef.current, 'clipPath');
        gsap.set(nextElementRef.current, { display: 'block' });
        setIsNextVisible(true);
        gsap.to(nextElementRef.current, {
          clipPath: 'polygon(25% 25%, 75% 25%, 75% 75%, 25% 75%)',
          duration: 0.5,
          ease: 'power2.out',
        });
      } else {
        const targetPolygon = getPolygonFromDistance(totalDistanceRef.current);
        const progress = Math.min(totalDistanceRef.current / 50, 1);
        const duration = 0.1 + progress * 0.2;

        gsap.killTweensOf(
          nextElement.querySelector(
            `#hero__item__content-${getNextIndex(currentIndex)}`
          ),
          'clipPath'
        );

        gsap.set(nextElement, { display: 'block' });

        setIsNextVisible(true);

        gsap.to(
          nextElement.querySelector(
            `#hero__item__content-${getNextIndex(currentIndex)}`
          ),
          {
            clipPath: targetPolygon,
            duration: duration,
            ease: 'power2.out',
          }
        );
      }
    }

    setIsCursorMoving(true);

    if (cursorTimeoutRef.current) {
      clearTimeout(cursorTimeoutRef.current);
    }

    cursorTimeoutRef.current = window.setTimeout(() => {
      setIsCursorMoving(false);

      totalDistanceRef.current = 0;

      if (nextElement && !isInHitArea) {
        gsap.killTweensOf(
          nextElement.querySelector(
            `#hero__item__content-${getNextIndex(currentIndex)}`
          ),
          'clipPath'
        );

        gsap.to(
          nextElement.querySelector(
            `#hero__item__content-${getNextIndex(currentIndex)}`
          ),
          {
            clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)',
            duration: 2,
            ease: 'power3.out',
            onComplete: () => {
              gsap.set(nextElement, { display: 'none' });
              setIsNextVisible(false);
            },
          }
        );
      }
    }, 300);
  };

  const handleHitAreaMouseEnter = () => {
    setIsInHitArea(true);
  };

  const handleHitAreaMouseLeave = () => {
    setIsInHitArea(false);
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

  useGSAP(() => {
    gsap.set(`#hero__item__content-${currentIndex}`, {
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
      borderRadius: '0% 0% 0% 0%',
    });
    gsap.to(`#hero__item__content-${currentIndex}`, {
      clipPath: 'polygon(34% 1%, 64% 1%, 76% 71%, 12% 44%)',
      borderRadius: '0% 0% 0% 0%',
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: `#hero__item__content-${currentIndex}`,
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
        {/* Move button outside video wrapper */}
        <div className="absolute top-20 left-4 z-100 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded cursor-pointer">
          CLICK ME
        </div>
        <div
          id="hit__area"
          className="absolute top-1/2 left-1/2 cursor-pointer aspect-square w-1/5 bg-amber-700 opacity-[0.3] transform -translate-x-1/2 -translate-y-1/2 z-100 max-md:top-[60%] max-md:w-1/2 md:w-1/5"
          onClick={handleVideoClick}
          onMouseEnter={handleHitAreaMouseEnter}
          onMouseLeave={handleHitAreaMouseLeave}
        ></div>

        {/* test monitoring */}

        <MonitorBox
          show={false}
          isCursorMoving={isCursorMoving}
          isInHitArea={isInHitArea}
          isNextVisible={isNextVisible}
          totalDistanceRef={totalDistanceRef}
          nextElementRef={nextElementRef}
        />

        {[1, 2, 3, 4].map((videoIndex) => {
          const isCurrent = videoIndex === currentIndex;
          const isNext = videoIndex === getNextIndex(currentIndex);

          let zIndex = 0;
          let display = 'none';

          if (videoIndex === 1) {
            zIndex = 1;
            display = 'block';
          } else if (videoIndex === 2) {
            zIndex = 2;
            display = 'none';
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
                id={`hero__item__content-${videoIndex}`}
                // ref={isNext ? nextElementRef : null}
                className="bg-[#5542ff] absolute top-0 left-0 h-full w-full"
                style={{
                  clipPath:
                    videoIndex === 1
                      ? 'polygon(0 0, 100% 0%, 100% 100%, 0% 100%)'
                      : 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)',
                }}
              >
                <div
                  id="hero__item__innerWrapper"
                  className={`absolute top-0 left-0 overflow-hidden opacity-100 visible transform translate-x-0 translate-y-0 scale-100 h-full w-full ${
                    isNext ? 'scale-[0.8]' : 'scale-100'
                  }`}
                >
                  {/* Debug info - remove later */}
                  <div className="absolute top-4 left-4 z-10 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                    {isCurrent ? 'CURRENT' : isNext ? 'NEXT' : 'HIDDEN'} - Video{' '}
                    {videoIndex}{' '}
                    {isNext &&
                      `(${isInHitArea ? 'HIT' : isCursorMoving ? 'MOVING' : 'STILL'})`}
                  </div>

                  <video
                    src={getVideoSrc(videoIndex)}
                    autoPlay
                    muted
                    loop
                    className={`h-full w-full absolute top-0 left-0 object-cover scale-[1.4]`}
                  ></video>
                </div>

                <svg
                  id="example__svg"
                  viewBox="0 0 850 610"
                  fill="none"
                  stroke="#000000"
                  strokeWidth={2}
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ width: '100%', height: 'auto' }}
                >
                  <path d="M838,-3 L838,-3 Q846,-3 846,5 L846,601 Q846,609 838,609 L5,609 Q-3,609 -3,601 L-3,5 Q-3,-3 5,-3 Z" />
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

// reference

// dot ---> polygon
// polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)

// polygon ---> 50% square
// polygon(25% 25%, 75% 25%, 75% 75%, 25% 75%)

// polygon ---> 100% square
// polygon(0 0, 100% 0%, 100% 100%, 0% 100%)
