import { motion } from "framer-motion";
import lollipop from "@/assets/candy-lollipop.png";
import swirly from "@/assets/candy-swirly.png";
import bears from "@/assets/candy-bears.png";
import twist from "@/assets/candy-twist.png";
import wheel from "@/assets/candy-wheel.png";
import jelly from "@/assets/candy-jelly.png";

type Item = {
  src: string;
  className: string;
  size: number;
  delay: number;
  duration: number;
  rotate: number;
};

const items: Item[] = [
  { src: lollipop, className: "top-[8%] left-[6%]", size: 90, delay: 0, duration: 7, rotate: 18 },
  { src: swirly, className: "top-[18%] right-[10%]", size: 120, delay: 0.6, duration: 8, rotate: -22 },
  { src: bears, className: "top-[55%] left-[4%]", size: 110, delay: 1.1, duration: 9, rotate: 12 },
  { src: twist, className: "bottom-[10%] right-[14%]", size: 100, delay: 0.4, duration: 7.5, rotate: -16 },
  { src: wheel, className: "bottom-[25%] left-[20%] hidden md:block", size: 80, delay: 1.6, duration: 8.5, rotate: 24 },
  { src: jelly, className: "top-[40%] right-[28%] hidden lg:block", size: 90, delay: 0.9, duration: 9.5, rotate: -10 },
];

export function FloatingCandies() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((it, i) => (
        <motion.img
          key={i}
          src={it.src}
          alt=""
          width={it.size}
          height={it.size}
          className={`absolute drop-shadow-2xl ${it.className}`}
          style={{ width: it.size, height: it.size }}
          initial={{ y: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: [0, -22, 0, 18, 0],
            rotate: [0, it.rotate, 0, -it.rotate / 2, 0],
            opacity: 1,
          }}
          transition={{
            duration: it.duration,
            delay: it.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}