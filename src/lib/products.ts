import fruity from "@/assets/candy-fruity.png";
import jelly from "@/assets/candy-jelly.png";
import bears from "@/assets/candy-bears.png";
import swirly from "@/assets/candy-swirly.png";
import twist from "@/assets/candy-twist.png";
import rolly from "@/assets/candy-rolly.png";
import pom from "@/assets/candy-pom.png";
import wheel from "@/assets/candy-wheel.png";
import puzzle from "@/assets/candy-puzzle.png";

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  mrp: string;
  pieces: string;
  flavors: string[];
  image: string;
  tint: string;
};

export const products: Product[] = [
  {
    slug: "fruity-pop",
    name: "Fruity Pop",
    tagline: "Burst of orchard joy",
    description: "Tangy fruit-flavored hard candy beads packed in colorful pouches kids can't put down.",
    mrp: "₹1",
    pieces: "200 pcs / jar",
    flavors: ["Orange", "Strawberry", "Mango", "Green Apple"],
    image: fruity,
    tint: "var(--candy-orange)",
  },
  {
    slug: "jelly-shapes",
    name: "Jelly Shapes",
    tagline: "Stars, moons & smiles",
    description: "Soft, chewy fruit jellies moulded into playful stars, hearts and moons. Pure pocket-money magic.",
    mrp: "₹2",
    pieces: "100 pcs / jar",
    flavors: ["Mixed Fruit", "Strawberry", "Lemon"],
    image: jelly,
    tint: "var(--candy-yellow)",
  },
  {
    slug: "jelly-bears",
    name: "Jelly Bears",
    tagline: "The classics, perfected",
    description: "Glossy, juicy gummy bears with the perfect bounce. Our best-selling jelly format.",
    mrp: "₹2",
    pieces: "120 pcs / jar",
    flavors: ["Strawberry", "Orange", "Apple", "Pineapple"],
    image: bears,
    tint: "var(--candy-red)",
  },
  {
    slug: "korean-swirly-pops",
    name: "Korean Swirly Pops",
    tagline: "Rainbow on a stick",
    description: "Premium rainbow swirl lollipops inspired by Korean candy culture. Shelf-magnet quality.",
    mrp: "₹10",
    pieces: "24 pcs / box",
    flavors: ["Tutti Frutti", "Bubblegum"],
    image: swirly,
    tint: "var(--candy-pink)",
  },
  {
    slug: "twist-spring-pops",
    name: "Twist Spring Pops",
    tagline: "A pop with personality",
    description: "Spring-shaped swirl lollipops with sweet–tangy fruit notes and an unforgettable look.",
    mrp: "₹5",
    pieces: "40 pcs / box",
    flavors: ["Strawberry", "Mango", "Mixed"],
    image: twist,
    tint: "var(--candy-pink)",
  },
  {
    slug: "rollypop",
    name: "Rollypop",
    tagline: "Roll into happiness",
    description: "Classic round lollipops with vibrant rainbow rings. A nostalgic favourite for every counter.",
    mrp: "₹5",
    pieces: "50 pcs / box",
    flavors: ["Strawberry", "Orange", "Cola"],
    image: rolly,
    tint: "var(--candy-red)",
  },
  {
    slug: "pom-pop",
    name: "Pom Pop",
    tagline: "Soft, sweet, surprising",
    description: "Fluffy cotton-candy pom-pops that melt on the tongue. A premium impulse buy.",
    mrp: "₹10",
    pieces: "20 pcs / box",
    flavors: ["Strawberry", "Bubblegum"],
    image: pom,
    tint: "var(--candy-pink)",
  },
  {
    slug: "wheelish",
    name: "Wheelish",
    tagline: "Spin into flavour",
    description: "Wheel-shaped swirl pops that look as good as they taste — guaranteed kid magnet.",
    mrp: "₹5",
    pieces: "30 pcs / box",
    flavors: ["Rainbow Fruit"],
    image: wheel,
    tint: "var(--candy-blue)",
  },
  {
    slug: "puzzle-ball",
    name: "Puzzle Ball",
    tagline: "Play. Solve. Sweeten.",
    description: "Round candy + mini puzzle in one pack. Combines play and snacking — parents approved.",
    mrp: "₹10",
    pieces: "24 pcs / box",
    flavors: ["Tutti Frutti", "Mixed Fruit"],
    image: puzzle,
    tint: "var(--candy-yellow)",
  },
];