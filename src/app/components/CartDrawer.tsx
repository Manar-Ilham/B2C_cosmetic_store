import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { Button } from '@/app/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/app/components/ui/sheet';
import Image from 'next/image';

const CartDrawer: React.FC = () => {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    getTotalPrice, 
    isOpen, 
    setIsOpen,
    clearCart 
  } = useCart();

  const total = getTotalPrice();

  if (items.length === 0) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Shopping Cart</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">Add some beautiful cosmetics to get started!</p>
            <Button className="btn-primary" onClick={() => setIsOpen(false)}>
              Continue Shopping
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({items.length} items)</SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">{item.vendor}</p>
                  <p className="font-semibold text-primary">${item.price.toFixed(2)}</p>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(item.id)}
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="h-8 w-8"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="h-8 w-8"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t border-border pt-4 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-xl font-bold text-primary">${total.toFixed(2)}</span>
          </div>
          
          <div className="space-y-2">
            <Button className="btn-primary w-full">
              Proceed to Checkout
            </Button>
            <Button 
              variant="outline" 
              onClick={clearCart}
              className="w-full"
            >
              Clear Cart
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;