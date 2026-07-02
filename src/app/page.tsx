import { NavBar } from "@/components/portfolio/nav-bar";
import { Hero } from "@/components/portfolio/hero";
import { About } from "@/components/portfolio/about";
import { Industries } from "@/components/portfolio/industries";
import { Contact } from "@/components/portfolio/contact";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <NavBar />
      <Hero />
      <About />
      <Industries />
      <Contact />
    </main>
  );
}
