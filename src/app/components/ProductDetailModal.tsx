import React from 'react';
import { Star, ShoppingCart, Phone, Heart } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { useToast } from '@/app/hooks/use-toast';
import { Product } from './ProductCard';
import { getProductImage } from '@/app/utils/productImages';
import Image from 'next/image';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose
}) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  if (!product) return null;

  const handleAddToCart = () => {
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

  const handleCallSupplier = () => {
    toast({
      title: "Contact Request",
      description: `We'll connect you with ${product.vendor} shortly.`,
    });
  };

  const handleWishlist = () => {
    toast({
      title: "Added to wishlist",
      description: `${product.name} has been saved to your wishlist.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative">
              <Image
                src={getProductImage(product.id)}
                alt={product.name}
                className="w-full h-96 object-cover rounded-xl"
              />
              {product.stock < 10 && (
                <Badge variant="destructive" className="absolute top-4 left-4">
                  Only {product.stock} left
                </Badge>
              )}
            </div>
            
            {/* Thumbnail gallery placeholder */}
            <div className="flex space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`w-20 h-20 rounded-lg border-2 cursor-pointer ${
                    i === 0 ? 'border-primary' : 'border-border'
                  }`}
                >
                  <Image
                    src={getProductImage(product.id)}
                    alt={`${product.name} ${i + 1}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {product.name}
              </h1>
              <p className="text-lg text-muted-foreground">by {product.vendor}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Tags */}
            <div>
              <h3 className="font-semibold mb-2">Features</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag.replace('-', ' ')}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <div className="flex space-x-3">
                <Button
                  onClick={handleAddToCart}
                  className="btn-primary flex-1"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleWishlist}
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              
              <Button
                variant="outline"
                onClick={handleCallSupplier}
                className="w-full"
              >
                <Phone className="h-4 w-4 mr-2" />
                Contact Supplier
              </Button>
            </div>

            {/* Vendor Info */}
            <div className="border-t border-border pt-4">
              <h3 className="font-semibold mb-2">Vendor Information</h3>
              <div className="bg-muted rounded-lg p-4">
                <p className="font-medium">{product.vendor}</p>
                <p className="text-sm text-muted-foreground">
                  Trusted cosmetics supplier since 2019
                </p>
                <p className="text-sm text-muted-foreground">
                  Stock: {product.stock} units available
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 border-t border-border pt-6">
          <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, starIndex) => (
                        <Star
                          key={starIndex}
                          className={`h-4 w-4 ${
                            starIndex < 4 + i
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium">Customer {i + 1}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {i + 1} week{i === 0 ? '' : 's'} ago
                  </span>
                </div>
                <p className="text-muted-foreground">
                  Great product! Really love the quality and the results. 
                  {i === 0 && ' Highly recommend to anyone looking for premium cosmetics.'}
                  {i === 1 && ' Fast shipping and excellent packaging.'}
                  {i === 2 && ' Will definitely order again.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;