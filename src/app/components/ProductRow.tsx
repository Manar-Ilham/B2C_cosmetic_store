import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import ProductCard, { Product } from './ProductCard';

interface ProductRowProps {
  title: string;
  subtitle?: string;
  products: Product[];
  onProductClick?: (product: Product) => void;
}

const ProductRow: React.FC<ProductRowProps> = ({ 
  title, 
  subtitle, 
  products, 
  onProductClick 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320; // Width of one card plus margin
      const newScrollLeft = scrollRef.current.scrollLeft + 
        (direction === 'right' ? scrollAmount : -scrollAmount);
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {title}
            </h2>
            {subtitle && (
              <p className="text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Products Container */}
        <div className="relative group">
          <div
            ref={scrollRef}
            className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-72">
                <ProductCard 
                  product={product} 
                  onProductClick={onProductClick}
                />
              </div>
            ))}
          </div>

          {/* Mobile Navigation Hint */}
          <div className="md:hidden text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Swipe to see more products →
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductRow;