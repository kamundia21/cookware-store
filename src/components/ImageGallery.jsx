import { useState } from 'react';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';

export function ImageGallery({ images, selected, onSelect }) {
  const [isZoomed, setIsZoomed] = useState(false);

  const nextImage = () => {
    onSelect((selected + 1) % images.length);
  };

  const prevImage = () => {
    onSelect((selected - 1 + images.length) % images.length);
  };

  return (
    <div className="relative">
      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
        <img 
          src={images[selected]} 
          alt="Product"
          className={`w-full h-full object-cover cursor-zoom-in ${isZoomed ? 'scale-150' : ''}`}
          onClick={() => setIsZoomed(!isZoomed)}
        />
        <button 
          onClick={prevImage}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button 
          onClick={nextImage}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <button 
          onClick={() => setIsZoomed(!isZoomed)}
          className="absolute right-2 bottom-2 bg-white p-2 rounded-full shadow"
        >
          <Expand className="h-5 w-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(idx)}
            className={`aspect-square rounded-lg overflow-hidden border-2 ${
              selected === idx ? 'border-orange-500' : 'border-gray-200'
            }`}
          >
            <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}