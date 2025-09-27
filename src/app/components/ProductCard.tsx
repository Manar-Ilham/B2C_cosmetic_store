import React from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { useToast } from '@/app/hooks/use-toast';
import { getProductImage } from '@/app/utils/productImages';
import Image
 from 'next/image';
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  vendor: string;
  stock: number;
  tags: string[];
}

interface ProductCardProps {
  product: Product;
  onProductClick?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: getProductImage(product.id) as string,
      vendor: product.vendor
    });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Added to wishlist",
      description: `${product.name} has been saved to your wishlist.`,
    });
  };

  return (
    <div 
      className="card-product p-4 cursor-pointer group"
      onClick={() => onProductClick?.(product)}
    >
      {/* Product Image */}
      <div className="relative mb-4">
        <Image
          src={getProductImage(product.id)}
          alt={product.name}
          className="w-full h-48 object-cover rounded-xl"
        />
        
        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleWishlist}
          className="absolute top-2 right-2 bg-white/80 hover:bg-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200"
        >
          <Heart className="h-4 w-4" />
        </Button>

        {/* Stock Badge */}
        {product.stock < 10 && (
          <Badge variant="destructive" className="absolute top-2 left-2">
            Only {product.stock} left
          </Badge>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
            {product.name}
          </h3>
        </div>

        <p className="text-sm text-muted-foreground">{product.vendor}</p>

        {/* Rating */}
        <div className="flex items-center space-x-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>
          
          <Button
            onClick={handleAddToCart}
            size="sm"
            className="btn-primary opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-2">
          {product.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag.replace('-', ' ')}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;