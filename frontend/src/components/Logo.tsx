import { Droplets } from "lucide-react";

interface LogoProps {
  size?: number;
  className?: string;
}

/** Logo thương hiệu: icon giọt nước (lucide) + tên. Màu theo `text-*` của thẻ cha. */
export default function Logo({ size = 22, className = "" }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 font-bold ${className}`}>
      <Droplets size={size} strokeWidth={2.5} />
      <span>AutoWash Pro</span>
    </span>
  );
}
