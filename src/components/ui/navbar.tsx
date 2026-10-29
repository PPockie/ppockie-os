"use client";

import Image from "next/image";

import LOGO from "@/../public/images/logo.svg";
import { Fragment, useRef } from "react";
import {
  NAV_CONTACT_PLATFORMS,
  NAV_LIST,
  NAV_SETTINGS,
  NAVBAR,
  NAVBAR_VARIANT,
  RESUME_ID,
  type NavListProps,
  type NavPosition,
} from "@/constants/navbar";
import { matchSocial } from "@/components/matching-icon-social";
import type { Contact } from "@/libs/supabase/queries";
import { cn } from "@/libs/cn";
import { magnify, useAnimation } from "@/hooks/animation";
import { useNavPosition } from "@/components/nav/nav-provider";
import { useWindows } from "@/components/window/window-provider";

/** The dock below `lg` is touch-first and its slots are tight; skip the swell. */
const desktopMagnify: typeof magnify = (container, options) =>
  window.matchMedia("(min-width: 1024px)").matches
    ? magnify(container, options)
    : () => {};

const toContactItem = ({ id, platform, label, url }: Contact): NavListProps => {
  const social = matchSocial(platform);
  return {
    id,
    name: label,
    category: "contact",
    icon: social?.icon,
    className: social?.className,
    href: url,
  };
};

interface NavbarProps {
  position?: NavPosition;
  contacts?: Contact[];
}

const Navbar = ({ position, contacts = [] }: NavbarProps) => {
  const quickLinks = contacts.filter((c) => NAV_CONTACT_PLATFORMS.includes(c.platform.trim().toLowerCase()));
  const { open, hasDocuments } = useWindows();
  const items = [...NAV_LIST.filter((n) => n.windowId !== RESUME_ID || hasDocuments), ...quickLinks.map(toContactItem), NAV_SETTINGS];
  const { position: stored } = useNavPosition();
  const active = position ?? stored;
  const NAV_VARIANT = NAVBAR_VARIANT[active];
  const listRef = useRef<HTMLUListElement>(null);

  useAnimation(
    listRef,
    desktopMagnify,
    {
      axis: NAV_VARIANT.axis,
      selector: "li:not([aria-hidden])",
      ...NAVBAR.magnify,
    },
    [active]
  );

  return (
    <nav data-intro="nav" className={cn("absolute", NAVBAR.style.nav, NAV_VARIANT.nav, NAVBAR.dock.nav)}>
      <div className={cn(NAV_VARIANT.div, NAVBAR.dock.div)}>
        <div
          className={cn(
            "aspect-square flex items-center justify-center",
            NAVBAR.style.logo,
            NAV_VARIANT.item,
            NAVBAR.dock.logo
          )}
        >
          <Image
            draggable={false}
            width={NAVBAR.logo}
            height={NAVBAR.logo}
            src={LOGO}
            alt="ppockie web-developer"
          />
        </div>

        <ul ref={listRef} className={cn(NAV_VARIANT.ul, NAVBAR.dock.ul)}>
          {items.map(({ id, name, icon, category, className, href, windowId }, index) => {
            const next = items[index + 1];
            const endsCategory =
              next !== undefined && next.category !== category;

            return (
              <Fragment key={id}>
                <li
                  className={cn(
                    "group/item relative cursor-pointer p-2 aspect-square flex items-center justify-center",
                    NAVBAR.style.item,
                    NAV_VARIANT.item,
                    NAVBAR.dock.item,
                    category === "contact" && NAVBAR.dock.hidden,
                    className
                  )}
                >
                  {(() => {
                    const content = icon ?? (
                      <p className={NAVBAR.style.label}>{name}</p>
                    );
                    if (windowId) {
                      return (
                        <button
                          type="button"
                          aria-label={name}
                          onClick={() => open(windowId)}
                          className="flex size-full cursor-pointer items-center justify-center"
                        >
                          {content}
                        </button>
                      );
                    }
                    return href ? (
                      <a
                        href={href}
                        aria-label={name}
                        {...(href.startsWith("mailto:")
                          ? {}
                          : { target: "_blank", rel: "noopener noreferrer" })}
                        className="flex size-full items-center justify-center"
                      >
                        {content}
                      </a>
                    ) : (
                      content
                    );
                  })()}
                  {/* Icon-only items have no visible name, so show it on hover. */}
                  {icon && (
                    <span
                      role="tooltip"
                      className={cn(NAVBAR.style.tooltip, NAV_VARIANT.tip, NAVBAR.dock.hidden)}
                    >
                      {name}
                      <span
                        aria-hidden
                        className={cn(NAVBAR.style.tooltipArrow, NAV_VARIANT.tipArrow)}
                      />
                    </span>
                  )}
                </li>
                {endsCategory && (
                  <li
                    aria-hidden
                    className={cn(NAVBAR.style.divider, NAV_VARIANT.divider, NAVBAR.dock.hidden)}
                  />
                )}
              </Fragment>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
