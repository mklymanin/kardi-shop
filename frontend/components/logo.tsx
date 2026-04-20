import * as React from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => (
  <Image
    src="/kandiru-logo.png"
    alt="KARDI"
    width={300}
    height={48}
    className={className}
  />
);

export default Logo;
