'use client';

import * as React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { EmblaOptionsType } from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MotionCarouselProps {
  slides: number[];
  options?: EmblaOptionsType;
  images?: string[];
}



export const MotionCarousel: React.FC<MotionCarouselProps> = ({ slides, options, images }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { ...options, loop: true }, 
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const scrollPrev = React.useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = React.useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative w-full max-w-7xl mx-auto py-12 px-4 group/carousel">
      <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
        <div className="flex -ml-12 md:-ml-20">
          {slides.map((index) => (
            <div 
              key={index} 
              className="flex-[0_0_220px] md:flex-[0_0_280px] min-w-0 pl-12 md:pl-20"
            >
              <div
                className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-neutral-800 shadow-2xl group"
              >
                {images && images[index % images.length] ? (
                  <img 
                    src={images[index % images.length]} 
                    alt={`Arctic Penguin NFT #${index}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
                    <span className="font-xirod text-white/20 text-4xl">#{index}</span>
                  </div>
                )}
                
                {/* Overlay Info */}
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/20 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-bold tracking-widest text-white/60 uppercase mb-1">Arctic Penguin</p>
                      <h4 className="font-xirod text-lg">COLLECTION</h4>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                      <span className="text-[10px] font-bold">Rarity: Epic</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-8 mt-12">
        <button
          onClick={scrollPrev}
          className="w-12 h-12 rounded-full bg-black hover:bg-white text-white hover:text-black transition-all flex items-center justify-center border border-neutral-700"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex gap-3">
          {slides.map((index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`h-2 rounded-full transition-all duration-300 border border-neutral-800 ${
                selectedIndex === index ? 'w-10 bg-white' : 'w-2.5 bg-neutral-700'
              }`}
            />
          ))}
        </div>

        <button
          onClick={scrollNext}
          className="w-12 h-12 rounded-full bg-black hover:bg-white text-white hover:text-black transition-all flex items-center justify-center border border-neutral-700"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};
