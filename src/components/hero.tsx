import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [nextIndex, setNextIndex] = useState(2);
  const [isPreloading, setIsPreloading] = useState(false);
  const [isNextReady, setIsNextReady] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);
  const [isInnerAnimating, setIsInnerAnimating] = useState(false);
  const [innerPreviewIndex, setInnerPreviewIndex] = useState(3);

  const currentVideoRef = useRef<HTMLVideoElement>(null);
  const nextVideoRef = useRef<HTMLVideoElement>(null);
  const videoLimit = 4;

  const getVideoSrc = (index: number) => `/videos/hero-${index}.mp4`;

  // When user clicks, start preloading the next video
  const handleVideoClick = () => {
    if (isPreloading) return; // Prevent double click
    setIsPreloading(true);
    setIsNextReady(false);
    const newNextIndex = currentIndex === videoLimit ? 1 : currentIndex + 1;
    setNextIndex(newNextIndex);
    const newPreviewIndex = newNextIndex === videoLimit ? 1 : newNextIndex + 1;
    setInnerPreviewIndex(newPreviewIndex);
    setIsInnerAnimating(true);
  };

  const handleNextVideoLoaded = () => {
    setIsNextReady(true);
    setHasClicked(true);
  };

  useGSAP(
    () => {
      if (isInnerAnimating) {
        gsap.fromTo(
          '#current-video',
          { scale: 0.09 },
          {
            scale: 1.5,
            duration: 1,
            ease: 'expo.inOut',
            onComplete: () => {
              setIsInnerAnimating(false);
            },
          }
        );
      }
    },
    { dependencies: [isInnerAnimating] }
  );

  // When animation is done, update the current video
  useGSAP(
    () => {
      if (hasClicked && isNextReady) {
        gsap.set('#next-video', { scale: 0.8, opacity: 1, display: 'block' });
        gsap.to('#next-video', {
          scale: 1,
          opacity: 1,
          transformOrigin: 'center center',
          width: '100%',
          height: '100%',
          duration: 1,
          ease: 'expo.inOut',
          onStart: () => {
            nextVideoRef.current?.play();
          },
          onComplete: () => {
            setCurrentIndex(nextIndex);
            setIsPreloading(false);
            setHasClicked(false);
            setIsNextReady(false);
            setInnerPreviewIndex(nextIndex === videoLimit ? 1 : nextIndex + 1);
          },
        });
      }
    },
    { dependencies: [hasClicked, isNextReady], revertOnUpdate: true }
  );

  return (
    <section className="relative h-dvh w-screen overflow-x-hidden">
      <div
        id="video-palyer-total-bg"
        className="relative z-5 h-dvh w-screen overflow-hidden"
      >
        <div>
          {/* This layer is the Limit for the video Wrapper*/}
          <div className="mask-clip-path absolute-center absolute rounded-lg overflow-hidden z-30">
            {/* here the video Wrapper is scaled from 50 to 100*/}
            <div
              className={`cursor-pointer text-4xl rounded-lg overflow-hidden origin-center transition-all duration-400 ease-linear ${
                isInnerAnimating
                  ? ''
                  : 'scale-50 opacity-0 hover:scale-150 hover:opacity-100 '
              }`}
              onClick={handleVideoClick}
            >
              {/* Inner clickable video always previews the next-next video */}
              <video
                id="current-video"
                autoPlay
                src={getVideoSrc(innerPreviewIndex)}
                ref={currentVideoRef}
                loop
                muted
                className="size-64 origin-center object-cover rounded-lg border-[2px] border-black"
              ></video>
            </div>
          </div>
        </div>
        {/* Preload and animate the next video only when preloading */}
        {isPreloading && (
          <video
            src={getVideoSrc(nextIndex)}
            ref={nextVideoRef}
            autoPlay
            loop
            muted
            id="next-video"
            className="z-20 absolute-center absolute size-64 object-cover object-center rounded-lg border border-black"
            onLoadedData={handleNextVideoLoaded}
            style={{ pointerEvents: 'none' }}
          ></video>
        )}
        {/* Background video for seamless look */}
        <video
          src={getVideoSrc(currentIndex)}
          autoPlay
          loop
          muted
          className="absolute-center absolute size-full object-cover object-center"
        ></video>
      </div>
      <h1 className="text-6xl text-amber-400 font-zentry absolute right-5 bottom-5 z-35">
        Gaming
      </h1>

      <div className="absolute top-0 left-0 size-fit z-35 text-amber-400 font-zentry">
        <div className="">
          <h1 className="text-6xl">Messhiah</h1>
          <p>The Boy from Rosario</p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
