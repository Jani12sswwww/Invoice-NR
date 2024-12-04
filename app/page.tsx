import { Hero } from "./components/Hero";
import { Navbar } from "./components/Navbar";
import { SpeedInsights } from "@vercel/speed-insights/next"
export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Navbar />
      <Hero />
    </main>
  );
}