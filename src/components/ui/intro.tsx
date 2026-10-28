"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import LogoCircle from "@/components/ui/logo";
import { NAV_POSITIONS, type NavPosition } from "@/constants/navbar";

/** Which margin carries the navbar in from off-screen, per stored position. */
const NAV_ENTRY = {
  default: { prop: "marginLeft", from: -140 },
  top: { prop: "marginTop", from: -140 },
  bottom: { prop: "marginBottom", from: -140 },
} as const satisfies Record<NavPosition, { prop: string; from: number }>;

/** Fired once the intro has played (or been skipped) and the desktop is interactive. */
export const INTRO_DONE_EVENT = "intro-done";

const RING_TEXT_COLOR = "rgb(250, 250, 250)";

const target = (name: string) =>
  document.querySelector<HTMLElement>(`[data-intro="${name}"]`);

const storedNavPosition = (): NavPosition => {
  const value = document.documentElement.dataset.nav as NavPosition;
  return NAV_POSITIONS.includes(value) ? value : "default";
};

const Intro = () => {
  useGSAP(() => {
    const root = document.documentElement;
    const overlay = target("overlay");
    const logo = target("logo-face");
    const introLogo = target("intro-logo");
    const avatar = target("avatar");
    const ring = target("ring");
    const nav = target("nav");

    const finish = () => {
      root.dataset.introDone = "";
      window.dispatchEvent(new Event(INTRO_DONE_EVENT));
      gsap.set(logo, { clearProps: "opacity" });
      gsap.set(nav, { clearProps: "opacity,margin" });
      gsap.set(avatar, { clearProps: "opacity,margin" });
      gsap.set(ring, { clearProps: "margin" });
      gsap.set(target("folders"), { clearProps: "opacity,visibility" });
      gsap.set(document.querySelectorAll('[data-intro="folder"]'), {
        clearProps: "opacity,visibility,scale,transform",
      });
      gsap.set(ring?.children ?? [], { clearProps: "opacity,visibility" });
      gsap.set(ring?.querySelectorAll("span") ?? [], { clearProps: "color" });
      gsap.set(overlay, { display: "none" });
    };

    if (
      !overlay ||
      !logo ||
      !introLogo ||
      !avatar ||
      !ring ||
      !nav ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      finish();
      return;
    }

    // The dock sits at the bottom below `lg` whichever position is stored.
    const entry = window.matchMedia("(max-width: 1023.98px)").matches
      ? NAV_ENTRY.bottom
      : NAV_ENTRY[storedNavPosition()];
    const ringPaths = Array.from(ring.querySelectorAll("svg"));
    const ringLetters = Array.from(ring.querySelectorAll("span"));

    const folders = target("folders");
    const folderItems = Array.from(
      document.querySelectorAll<HTMLElement>('[data-intro="folder"]')
    );

    const tl = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: finish });

    tl.fromTo(
      introLogo,
      { autoAlpha: 0, y: 160 },
      { autoAlpha: 1, y: 0, duration: 0.9 }
    )
      .addLabel("zoom", "+=0.2")
      .to(introLogo, { scale: 12, duration: 1.1, ease: "power4.in"}, "zoom")
      .to(overlay, { autoAlpha: 0, duration: 0.1 }, "zoom+=1.1")
      .addLabel("reveal", "zoom+=1.2")
      .to(introLogo, { autoAlpha: 0, duration: 0.6, ease: "power2.out" }, "reveal")
      .fromTo(
        logo,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.8, ease: "power2.out" },
        "reveal+=0.7"
      )
      .fromTo(
        avatar,
        { autoAlpha: 0, marginBottom: -160 },
        { autoAlpha: 1, marginBottom: 0, duration: 1.1 },
        "reveal+=0.2"
      )
      .fromTo(
        ring,
        { marginBottom: 160 },
        { marginBottom: 0, duration: 1.1 },
        "reveal+=0.35"
      )
      .fromTo(
        ringPaths,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.9, ease: "power2.out" },
        "reveal+=0.35"
      )
      .fromTo(
        ringLetters,
        { color: "rgba(250, 250, 250, 0)" },
        { color: RING_TEXT_COLOR, duration: 0.9, ease: "power2.out" },
        "reveal+=0.35"
      )
      .fromTo(
        nav,
        { autoAlpha: 0, [entry.prop]: entry.from },
        { autoAlpha: 1, [entry.prop]: 0, duration: 0.9 },
        "reveal+=0.5"
      );

    // The container only exists to be hidden until now; the folders themselves
    // pop in one after another.
    if (folders) {
      tl.set(folders, { autoAlpha: 1 }, "reveal+=0.8").fromTo(
        folderItems,
        { autoAlpha: 0, scale: 0.6 },
        { autoAlpha: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)", stagger: 0.08 },
        "reveal+=0.8"
      );
    }

    return () => {
      delete root.dataset.introDone;
    };
  }, []);

  return (
    <>
      <div
        aria-hidden
        data-intro="overlay"
        className="fixed inset-0 z-46 bg-[#171717] pointer-events-none"
      />
      {/* Above the real logo's dark square, so the disc rises over it. */}
      <div
        aria-hidden
        data-intro="intro-logo"
        className="fixed inset-0 z-51 flex items-center justify-center pointer-events-none opacity-0"
      >
        <LogoCircle />
      </div>
    </>
  );
};

export default Intro;
