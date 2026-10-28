import { RiGithubFill, RiLineFill, RiLinkedinFill } from "@remixicon/react";
import FacebookIcon from "@iconify-react/logos/facebook";
import InstagramIcon from "@iconify-react/logos/instagram-icon";
import TiktokIcon from "@iconify-react/logos/tiktok-icon";
import GmailIcon from "@iconify-react/logos/google-gmail";
import type { ReactNode } from "react";

export interface SocialMatch {
  icon: ReactNode;
  className?: string;
}

const DEFAULT_SIZE = 28;

const SOCIALS: Record<string, (size: number) => SocialMatch> = {
  facebook: (size) => ({
    icon: <FacebookIcon width={`${size}`} height={`${size}`} />,
    className: "bg-[#1877f2]",
  }),
  instagram: (size) => ({
    icon: <InstagramIcon width={`${size}`} height={`${size}`} />,
  }),
  github: (size) => ({
    icon: <RiGithubFill size={size + 4} color="#f0f0f0" />,
    className: "bg-gray-800",
  }),
  linkedin: (size) => ({
    icon: <RiLinkedinFill size={size + 4} color="#ffffff" />,
    className: "bg-[#0a66c2]",
  }),
  line: (size) => ({
    icon: <RiLineFill size={size + 4} color="#ffffff" />,
    className: "bg-[#06c755]",
  }),
  tiktok: (size) => ({
    icon: <TiktokIcon width={`${size}`} height={`${size}`} />,
    className: "bg-black",
  }),
  gmail: (size) => ({
    icon: <GmailIcon width={`${size}`} height={`${size}`} />,
  }),
};

const ALIASES: Record<string, keyof typeof SOCIALS> = {
  ig: "instagram",
  email: "gmail",
  mail: "gmail",
};

export function matchSocial(
  platform: string,
  size: number = DEFAULT_SIZE
): SocialMatch | null {
  const key = platform.trim().toLowerCase();
  const build = SOCIALS[ALIASES[key] ?? key];
  return build ? build(size) : null;
}
