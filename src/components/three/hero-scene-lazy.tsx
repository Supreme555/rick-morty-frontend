"use client";

import dynamic from "next/dynamic";

/**
 * three.js + the models are ~1 MB of JS and ~4 MB of GLB: loaded only in the
 * browser, only on the home page, after the rest of the hero has rendered.
 */
const HeroScene = dynamic(() => import("./hero-scene"), {
  ssr: false,
  loading: () => <div aria-hidden="true" className="skeleton h-full w-full rounded-card" />,
});

export function HeroSceneLazy() {
  return (
    <div className="h-[300px] w-full overflow-hidden rounded-card border border-line bg-panel-2 sm:h-[380px] lg:h-[460px]">
      <HeroScene />
    </div>
  );
}
