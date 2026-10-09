import fruity from "@/assets/brochure/fruity-pop.jpg";
import jelly from "@/assets/brochure/jelly-shapes.jpg";
import bears from "@/assets/brochure/jelly-bears.jpg";
import swirly from "@/assets/brochure/korean-swirly-pops.jpg";
import twist from "@/assets/brochure/twist-spring-pops.jpg";
import rolly from "@/assets/brochure/rollypop.jpg";
import pom from "@/assets/brochure/pom-pop.jpg";
import wheel from "@/assets/brochure/wheelish.jpg";
import puzzle from "@/assets/brochure/puzzle-ball.jpg";

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  mrp: string;
  packPrice: string;
  pieces: string;
  flavors: string[];
  image: string;
  tint: string;
};

export const products: Product[] = [
  {
    slug: "fruity-pop",
    name: "Fruity Pop",
    tagline: "Fruit flavour lollipop",
    description:
      "Juicy fruit-flavoured lollipops in five irresistible flavours. The shelf-magnet that moves cartons.",
    mrp: "₹5",
    packPrice: "₹360",
    pieces: "72 pcs × ₹5",
    flavors: ["Watermelon", "Jaamun", "Orange", "Strawberry", "Kaccha Aam"],
    image: fruity,
    tint: "var(--candy-orange)",
  },
  {
    slug: "jelly-shapes",
    name: "Jelly Shapes",
    tagline: "Fruity flavour soft candy",
    description:
      "Soft, chewy fruit jellies in rings, cubes and hearts. Comes with a FREE gift inside every pack.",
    mrp: "₹10",
    packPrice: "₹240",
    pieces: "24 pcs × ₹10",
    flavors: ["Mixed Fruit", "Watermelon", "Orange"],
    image: jelly,
    tint: "var(--candy-yellow)",
  },
  {
    slug: "jelly-bears",
    name: "Jelly Bears",
    tagline: "Soft candy with free gift",
    description:
      "Cuddly fruity bear-shaped soft candy in pink hero-packs. Free gift inside — kids ask by name.",
    mrp: "₹10",
    packPrice: "₹240",
    pieces: "24 pcs × ₹10",
    flavors: ["Strawberry", "Watermelon", "Mixed Fruit"],
    image: bears,
    tint: "var(--candy-pink)",
  },
  {
    slug: "korean-swirly-pops",
    name: "Korean Swirly Pops",
    tagline: "K-pop inspired swirl lollipops",
    description:
      "Premium round swirl pops with sweet Korean phrases — Saranghae, Happy Birthday, I Miss You & more. Built to gift, built to sell.",
    mrp: "₹10",
    packPrice: "₹250",
    pieces: "25 pcs × ₹10",
    flavors: ["Strawberry", "Lychee", "Orange", "Pineapple", "Mango"],
    image: swirly,
    tint: "var(--candy-pink)",
  },
  {
    slug: "twist-spring-pops",
    name: "Twist Spring Pops",
    tagline: "Spiral hard-boiled candy on a stick",
    description:
      "Hand-pulled twist spring pops in five vibrant colours. Confetti display box turns counters into magnets.",
    mrp: "₹10",
    packPrice: "₹250",
    pieces: "25 pcs × ₹10",
    flavors: ["Strawberry", "Blue Raspberry", "Orange", "Apple", "Mango"],
    image: twist,
    tint: "var(--candy-red)",
  },
  {
    slug: "rollypop",
    name: "Rollypop",
    tagline: "Classic swirl lollipop jar",
    description:
      "The OG round swirl lollipops in display-ready candy jars — red, yellow and blue. A counter classic at just ₹5.",
    mrp: "₹5",
    packPrice: "₹200",
    pieces: "40 pcs × ₹5",
    flavors: ["Strawberry", "Pineapple", "Blue Raspberry"],
    image: rolly,
    tint: "var(--candy-blue)",
  },
  {
    slug: "pom-pop",
    name: "Pom Pop",
    tagline: "Soft jelly spiral pops",
    description:
      "Sugar-dusted swirl jelly pops in cherry, orange and apple. Display jars built for impulse buys.",
    mrp: "₹5",
    packPrice: "₹200",
    pieces: "40 pcs × ₹5",
    flavors: ["Cherry", "Orange", "Apple", "Watermelon"],
    image: pom,
    tint: "var(--candy-orange)",
  },
  {
    slug: "wheelish",
    name: "Wheelish",
    tagline: "Bicycle-shaped candy dispenser",
    description:
      "A tiny bicycle whose wheels are see-through candy jars. Toy + candy in one — kids beg for it.",
    mrp: "₹10",
    packPrice: "₹240",
    pieces: "24 pcs × ₹10",
    flavors: ["Mixed Fruit Beads"],
    image: wheel,
    tint: "var(--candy-pink)",
  },
  {
    slug: "puzzle-ball",
    name: "Puzzle Ball",
    tagline: "Puzzle toy + candy beads",
    description:
      "Interlocking puzzle ball with colourful candy beads inside. Play it, solve it, snack it — every kid's favourite.",
    mrp: "₹10",
    packPrice: "₹300",
    pieces: "30 pcs × ₹10",
    flavors: ["Mixed Fruit Beads"],
    image: puzzle,
    tint: "var(--candy-blue)",
  },
];
