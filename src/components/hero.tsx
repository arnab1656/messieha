import { useRef, useState } from 'react';

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [loadedVideo, setLoadedVideo] = useState(1);

  const innerVideo = useRef<HTMLVideoElement>(null);
  const videoLimit = 3;

  let nextPage = (currentIndex % videoLimit) + 1;

  const handleVideoClick = () => {
    setCurrentIndex(nextPage);
  };

  const handleVideoLoad = () => {
    setLoadedVideo((prev) => {
      return prev + 1;
    });
  };

  const getVideoSrc = (index: number) => {
    return `/videos/hero-${index}.mp4`;
  };

  return (
    <section className="relative h-dvh w-screen overflow-x-hidden">
      <div
        id="video-palyer-total-bg"
        className="relative z-5 h-dvh w-screen overflow-hidden"
      >
        <div>
          {/* This layer is the Limit for the video Wrapper*/}
          <div className="mask-clip-path absolute-center absolute rounded-lg overflow-x-hidden z-30">
            {/* here the video Wrapper is scaled from 50 to 100*/}
            <div
              className="cursor-pointer text-4xl rounded-lg overflow-hidden origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100"
              onClick={handleVideoClick}
            >
              {/* here the video is scaled */}
              <video
                id="current-video"
                autoPlay
                src={getVideoSrc(currentIndex + 1)}
                ref={innerVideo}
                loop
                muted
                className="size-64 scale-150 origin-center object-cover"
                onLoadedData={handleVideoLoad}
              ></video>
            </div>
          </div>
        </div>
        {/* this video tag is for the animation i.e this video willbe animated from
        small to large */}
        <video
          src={getVideoSrc(currentIndex)}
          ref={innerVideo}
          autoPlay
          loop
          muted
          className="z-20 absolute-center absolute invisible size-64 object-cover object-center"
          onLoadedData={handleVideoLoad}
        ></video>
        <video
          src={getVideoSrc(currentIndex === videoLimit ? 1 : currentIndex)}
          autoPlay
          loop
          muted
          className="absolute-center absolute size-full object-cover object-center"
          onLoadedData={handleVideoLoad}
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

//_First make the hero section okay then make the
//_Then make the bg if it is color then make color or image or video anything but make the bg
