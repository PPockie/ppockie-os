"use client";

import {
  ringMarquee,
  RingMarqueeText,
  RingPath,
  stretchText,
  // StretchTexts,
  useAnimation,
  type RingGeometry,
} from "@/hooks/animation";
import { useRef } from "react";
import Image from "next/image";

import CHARACTOR from "@/../public/images/Charactor.png";
import { RING_TEXTS } from "@/constants/welcome";
import { FOLDERS } from "@/constants/folders";
import Folder from "@/components/ui/folder";
import { useWindows } from "@/components/window/window-provider";

const RING = { radiusX: 460, radiusY: 120, tilt: -14 } satisfies RingGeometry;

const BAND = 68;

const LAYER = { backText: 15, frontText: 45 };

const Welcome = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const { open } = useWindows();

  useAnimation(titleRef, stretchText, { faces: "title" });

  useAnimation(ringRef, ringMarquee, {
    ...RING,
    period: 24,
    frontScale: 1,
    backScale: 0.65,
    backZ: LAYER.backText,
    frontZ: LAYER.frontText,
  });

  return (
    <section id="welcome" className="w-full flex-1 select-none relative">
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <div data-intro="logo-face">
            {/* <LogoCircle /> */}
          </div>
        </div>
      </div>

      <div className="relative h-full">
        {/* <h1 ref={titleRef} className="cursor-none absolute bottom-[1%] left-1/2 -translate-1/2 text-center w-full rotate-[-14deg] z-30">
          <StretchTexts
            text="PPockie"
            className="text-9xl font-bold"
          />
        </h1> */}

        <div
          ref={ringRef}
          data-intro="ring"
          aria-hidden
          className="block absolute bottom-1/3 left-1/2 w-0 h-0 pointer-events-none"
        >
          <RingPath
            {...RING}
            half="back"
            thickness={BAND}
            edge={6}
            edgeClassName="text-neutral-200"
            className="z-10 text-neutral-900"
          />

          <RingMarqueeText
            items={RING_TEXTS}
            repeat={1}
            className="text-6xl font-bold text-neutral-50"
          />

          <RingPath
            {...RING}
            half="front"
            thickness={BAND}
            edge={6}
            edgeClassName="text-neutral-200"
            className="z-40 text-neutral-900 drop-shadow-[0_0_18px_rgba(0,0,0,0.65)]"
          />
        </div>

        <ul
          data-intro="folders"
          className="absolute inset-0 z-20 pointer-events-none max-lg:grid max-lg:grid-cols-4 md:max-lg:grid-cols-6 max-lg:content-start max-lg:justify-items-center max-lg:gap-y-4 max-lg:px-4 max-lg:pt-10"
        >
          {FOLDERS.map((item) => (
            <Folder key={item.id} item={item} onPress={() => open(item.id)} />
          ))}
        </ul>

        <Image
          draggable={false}
          width={620}
          src={CHARACTOR}
          // className="absolute -bottom-24 left-1/2 -translate-x-1/2 drop-shadow-2xl drop-shadow-neutral-500/25 z-30"
          className="absolute -bottom-24 left-1/2 -translate-x-1/2 drop-shadow-[0_0px_72px] drop-shadow-white z-30"
          data-intro="avatar"
          alt="Model charactor"
        />
      </div>

    </section>
  );
};

export default Welcome;
