"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const nextImage = () => {
    setSelectedImageIndex((current) => 
      current === images.length - 1 ? 0 : current + 1
    );
  };

  const previousImage = () => {
    setSelectedImageIndex((current) => 
      current === 0 ? images.length - 1 : current - 1
    );
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-square">
        <Image
          src={images[selectedImageIndex]}
          alt={productName}
          fill
          className="object-cover rounded-lg"
          priority
        />
        {images.length > 1 && (
          <>
            <button
              onClick={previousImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
      
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative aspect-square rounded-md overflow-hidden ${
                selectedImageIndex === index 
                  ? 'ring-2 ring-emerald-600' 
                  : 'hover:opacity-75'
              }`}
            >
              <Image
                src={image}
                alt={`${productName} - Vista ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}