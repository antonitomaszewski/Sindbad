"use client";

import TailwindSectionOne from "./section1";
import TailwindSectionTwo from "./section2";
import GridSection from "./section3";
import SpacingSection from "./section4";
import SizeSection from "./section5";
import TypographySection from "./section6";
import ColorsAndBordersSection from "./section7";
import ShadowsAndTransitionsSection from "./section8";
import PositioningSection from "./section9";
import OverflowAndMediaSection from "./section10";
import StatesSection from "./section11";

export default function TailwindPlayground() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-main">Tailwind Playground</h1>
        <p className="text-sm text-gray-600">
          Test podpunktu 1: kontener i typografia.
        </p>
      </header>

      <OverflowAndMediaSection />
    </div>
  );
}