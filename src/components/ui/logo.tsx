import Image from "next/image";
import LOGO from "@/../public/images/logo-dark.svg";

export default function LogoCircle() {
  const LOGO_CONFIG = {
    w: 250,
    h: 250,
  };
  return (
    <div className="w-fit p-2 border-4 border-white rounded-full">
      <div className="w-80 aspect-square rounded-full bg-white flex justify-center items-center">
        <Image
          draggable={false}
          width={LOGO_CONFIG.w}
          height={LOGO_CONFIG.h}
          src={LOGO}
          alt="ppockie web-developer"
        />
      </div>
    </div>
  );
}
