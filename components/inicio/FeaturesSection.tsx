"use client";

import { 
  Recycle, 
  Hammer, 
  MapPin, 
  Leaf, 
  Heart,
  ShieldCheck 
} from "lucide-react";
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";

export default function FeaturesSection() {
  const features = [
    {
      icon: <Recycle className="h-8 w-8 text-emerald-600" />,
      title: "Producte Reciclat",
      description: "Transformem bosses de plàstic en peces úniques, donant una segona vida als residus i reduint l'impacte ambiental."
    },
    {
      icon: <Hammer className="h-8 w-8 text-emerald-600" />,
      title: "Artesania Local",
      description: "Cada peça és elaborada a mà amb cura i dedicació, assegurant la màxima qualitat i atenció als detalls."
    },
    {
      icon: <MapPin className="h-8 w-8 text-emerald-600" />,
      title: "Fet a Girona",
      description: "Som una empresa local compromesa amb el desenvolupament sostenible de la nostra comunitat."
    },
    {
      icon: <Leaf className="h-8 w-8 text-emerald-600" />,
      title: "Moda Sostenible",
      description: "Creem moda ètica i sostenible que respecta el medi ambient sense renunciar a l'estil i la funcionalitat."
    },
    {
      icon: <Heart className="h-8 w-8 text-emerald-600" />,
      title: "Disseny Únic",
      description: "Cada producte és únic i irrepetible, amb dissenys exclusius que reflecteixen la nostra passió per l'artesania."
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-emerald-600" />,
      title: "Qualitat Garantida",
      description: "Assegurem la màxima qualitat en tots els nostres productes, amb materials duradors i acabats impecables."
    }
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    skipSnaps: false,
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 1, slidesToShow: 3 },
      '(max-width: 767px)': { slidesToScroll: 1, slidesToShow: 1 }
    }
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    
    // Auto-scroll every 5 seconds
    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => {
      emblaApi.off('select', onSelect);
      clearInterval(autoplay);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-light mb-4">El Nostre Compromís</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A NiDEES, combinem artesania tradicional amb sostenibilitat per crear productes únics i respectuosos amb el medi ambient.
          </p>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex-[0_0_100%] md:flex-[0_0_33.33%] px-4"
              >
                <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots navigation */}
        <div className="flex justify-center gap-2 mt-8">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === selectedIndex 
                  ? 'bg-emerald-600' 
                  : 'bg-gray-300 hover:bg-emerald-400'
              }`}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}