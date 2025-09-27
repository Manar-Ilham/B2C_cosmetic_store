import React, { useState } from 'react';
import { Search, ShoppingCart, Bell, User, Menu, X } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Badge } from '@/app/components/ui/badge';
import CartDrawer from './CartDrawer';

interface NavbarProps {
  onSearch?: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const { user, logout } = useAuth();
  const { getTotalItems, setIsOpen } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const totalItems = getTotalItems();

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'seller':
        return '/dashboard/seller';
      case 'consumer':
        return '/dashboard/consumer';
      case 'seller-consumer':
        return '/dashboard/seller-consumer';
      default:
        return '/';
    }
  };

  return (
    <>
      <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold text-gradient">
                Cosmetics
              </Link>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search cosmetics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 input-field"
                  />
                </div>
              </form>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="/about" className="nav-link">
                About us
              </a>

              {user ? (
                <div className="flex items-center space-x-4">
                  {/* Notifications */}
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      3
                    </Badge>
                  </Button>

                  {/* Cart */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    onClick={() => setIsOpen(true)}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {totalItems > 0 && (
                      <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {totalItems}
                      </Badge>
                    )}
                  </Button>

                  {/* Profile Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center space-x-2">
                        <User className="h-5 w-5" />
                        <span className="hidden lg:block">{user.name}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem asChild>
                        <a href={getDashboardLink()}>Dashboard</a>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a href="/profile">Profile</a>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a href="/orders">Orders</a>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" asChild>
                    <a href="/auth">Login</a>
                  </Button>
                  <Button className="btn-primary" asChild>
                    <a href="/auth">Sign up</a>
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search cosmetics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 input-field"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-card border-t border-border">
            <div className="px-4 py-3 space-y-3">
              <a href="/about" className="block nav-link">
                About us
              </a>
              
              {user ? (
                <>
                  <a href={getDashboardLink()} className="block nav-link">
                    Dashboard
                  </a>
                  <a href="/profile" className="block nav-link">
                    Profile
                  </a>
                  <a href="/orders" className="block nav-link">
                    Orders
                  </a>
                  <Button
                    variant="ghost"
                    onClick={() => setIsOpen(true)}
                    className="w-full justify-start"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Cart ({totalItems})
                  </Button>
                  <Button variant="ghost" onClick={handleLogout} className="w-full justify-start">
                    Logout
                  </Button>
                </>
              ) : (
                <div className="space-y-2">
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <a href="/auth">Login</a>
                  </Button>
                  <Button className="btn-primary w-full" asChild>
                    <a href="/auth">Sign up</a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
      
      <CartDrawer />
    </>
  );
};

export default Navbar;