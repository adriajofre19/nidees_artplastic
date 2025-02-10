"use client";

import Image from "next/image";

export default function HeaderSection() {
  return (
    <section className="relative">
      {/* Header Image */}
      <div className="relative h-[50vh] md:h-[60vh]">
        <Image
          src="/carrierbags.webp"
          alt="NiDEES - Artesanía Sostenible"
          fill
          className="object-cover brightness-50"
          priority
        />
      </div>

      {/* Text Content - Positioned over the image */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-6 text-left text-white">
          <img src="/whitelogo.png" alt="NiDEES - Artesanía Sostenible" className="w-40 mb-4" />
          <div className="space-y-4 text-base md:text-lg">
            <p className="leading-relaxed font-bold text-white">
              Artesania creada amb bosses de plàstic reciclades ♻️
            </p>
            <p className="leading-relaxed text-white">
              Som emprenedors amb l&apos;objectiu de reduir el nostre impacte mediambiental.
            </p>
            <p className="leading-relaxed text-white">
              Reutilitzem artesanalment les bosses de plàstic per convertir-les en dissenys únics i allargar la seva vida.
            </p>
            <div className="flex justify-end">
              <p className="leading-relaxed font-medium text-white">
                Per un món millor!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}