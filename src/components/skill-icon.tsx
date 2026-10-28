import type { ComponentType } from "react";
import { Icon } from "@iconify/react";
import CssIcon from "@iconify-react/logos/css-3";
import CloudflareIcon from "@iconify-react/logos/cloudflare-icon";
import DockerIcon from "@iconify-react/logos/docker-icon";
import FastifyIcon from "@iconify-react/logos/fastify-icon";
import FigmaIcon from "@iconify-react/logos/figma";
import GitIcon from "@iconify-react/logos/git-icon";
import GithubActionsIcon from "@iconify-react/logos/github-actions";
import GithubIcon from "@iconify-react/logos/github-icon";
import HtmlIcon from "@iconify-react/logos/html-5";
import JavascriptIcon from "@iconify-react/logos/javascript";
import NextjsIcon from "@iconify-react/logos/nextjs-icon";
import NodejsIcon from "@iconify-react/logos/nodejs-icon";
import PostgresqlIcon from "@iconify-react/logos/postgresql";
import PowerBiIcon from "@iconify-react/logos/microsoft-power-bi";
import PrismaIcon from "@iconify-react/logos/prisma";
import ReactIcon from "@iconify-react/logos/react";
import RedisIcon from "@iconify-react/logos/redis";
import TailwindIcon from "@iconify-react/logos/tailwindcss-icon";
import TypescriptIcon from "@iconify-react/logos/typescript-icon";
import UbuntuIcon from "@iconify-react/logos/ubuntu";
import VercelIcon from "@iconify-react/logos/vercel-icon";
import WordpressIcon from "@iconify-react/logos/wordpress-icon";

type Logo = ComponentType<{ width?: string; height?: string }>;

const LOGOS: Record<string, Logo> = {
  "typescript-icon": TypescriptIcon,
  javascript: JavascriptIcon,
  "html-5": HtmlIcon,
  "css-3": CssIcon,
  react: ReactIcon,
  "nextjs-icon": NextjsIcon,
  "tailwindcss-icon": TailwindIcon,
  "nodejs-icon": NodejsIcon,
  "fastify-icon": FastifyIcon,
  prisma: PrismaIcon,
  postgresql: PostgresqlIcon,
  redis: RedisIcon,
  "docker-icon": DockerIcon,
  "git-icon": GitIcon,
  "github-icon": GithubIcon,
  "github-actions": GithubActionsIcon,
  "vercel-icon": VercelIcon,
  "cloudflare-icon": CloudflareIcon,
  ubuntu: UbuntuIcon,
  figma: FigmaIcon,
  "wordpress-icon": WordpressIcon,
  "microsoft-power-bi": PowerBiIcon,
};

const ICON_SIZE = "36";

const initialsOf = (name: string) =>
  Array.from(name.trim()).slice(0, 2).join("").toLocaleUpperCase() || "?";

interface SkillIconProps {
  name: string;
  icon: string | null;
}

/**
 * A bare name ("react") is one of the bundled logos above. A name with a set prefix
 * ("skill-icons:expressjs-dark", as Iconify copies it) is loaded from the Iconify API at runtime.
 */
const SkillIcon = ({ name, icon }: SkillIconProps) => {
  const Logo = icon ? LOGOS[icon] : undefined;
  const remote = icon?.includes(":") ? icon : null;

  return (
    <span className="flex size-12 items-center justify-center rounded-lg text-xl text-neutral-900">
      {Logo ? (
        <Logo width={ICON_SIZE} height={ICON_SIZE} />
      ) : remote ? (
        <Icon icon={remote} width={ICON_SIZE} height={ICON_SIZE} />
      ) : (
        initialsOf(name)
      )}
    </span>
  );
};

export default SkillIcon;
