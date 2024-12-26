// src/components/Carousel.tsx
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { Carousel } from './ui/carousel'; // Adjust the import based on your setup

const images = [
  '/images/login-1.png',
  '/images/login-2.png',
  '/images/login-3.png',
  // Add more images as needed
];

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000); // Change image every 2 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <Carousel activeIndex={currentIndex}>
      {images.map((src, index) => (
        <div key={index} className="relative h-full w-full">
          <img
            src={src}
            alt={`Slide ${index + 1}`}
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      ))}
    </Carousel>
  );
};

export default ImageCarousel;
