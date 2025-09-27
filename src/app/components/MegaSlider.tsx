import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import Image, {StaticImageData} from 'next/image';

interface SlideData {
  id: string;
  url: string|StaticImageData;
  title: string;
  subtitle: string;
  link: string;
}

interface MegaSliderProps {
  slides: SlideData[];
  autoPlayInterval?: number;
}

const MegaSlider: React.FC<MegaSliderProps> = ({ 
  slides, 
  autoPlayInterval = 4000 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (!isHovered && slides.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      }, autoPlayInterval);

      return () => clearInterval(interval);
    }
  }, [isHovered, slides.length, autoPlayInterval]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <div 
      className="relative w-full h-64 md:h-96 lg:h-[500px] overflow-hidden rounded-2xl shadow-lg group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides Container */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="w-full h-full flex-shrink-0 relative"
          >
            <Image
              src={slide.url}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            
            {/* Overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            
            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-lg text-white">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                    {slide.title}
                  </h2>
                  <p className="text-lg md:text-xl mb-6 opacity-90">
                    {slide.subtitle}
                  </p>
                  <Button 
                    asChild
                    className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-2xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <a href={slide.link}>Shop Now</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentIndex
                ? 'bg-white scale-110'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div 
          className={`h-full bg-primary transition-all duration-200 ${
            isHovered ? 'animate-pulse' : ''
          }`}
          style={{ 
            width: `${((currentIndex + 1) / slides.length) * 100}%` 
          }}
        />
      </div>
    </div>
  );
};

export default MegaSlider;