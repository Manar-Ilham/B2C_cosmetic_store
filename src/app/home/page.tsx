"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '@/app/components/Navbar';
import MegaSlider from '@/app/components/MegaSlider';
import CategoryMenu from '@/app/components/CategoryMenu';
import ProductRow from '@/app/components/ProductRow';
import ProductDetailModal from '@/app/components/ProductDetailModal';
import ProductCard, { Product } from '@/app/components/ProductCard';
import productsData from '@/app/data/products.json';
import heroPomades from '@/app/assets/hero-pomades.jpg';
import heroLotions from '@/app/assets/hero-lotions.jpg';
import heroCremes from '@/app/assets/hero-cremes.jpg';

const HomePage: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(productsData.products);

  useEffect(() => {
    let filtered = productsData.products;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (activeCategory) {
      filtered = filtered.filter(product => product.category === activeCategory);
    }

    setFilteredProducts(filtered);
  }, [searchQuery, activeCategory]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setActiveCategory(''); // Clear category filter when searching
  };

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(activeCategory === categoryId ? '' : categoryId);
    setSearchQuery(''); // Clear search when selecting category
  };

  // Group products by category for display
  const getProductsByCategory = (categoryId: string) => {
    return filteredProducts.filter(product => product.category === categoryId);
  };

  // Hero slides with imported images
  const heroSlides = [
    {
      id: "1",
      url: heroPomades,
      title: "Premium Pomades Collection",
      subtitle: "Discover our range of professional styling products",
      link: "/category/pomades"
    },
    {
      id: "2",
      url: heroLotions,
      title: "Luxury Skincare Lotions",
      subtitle: "Nourish your skin with our premium formulas",
      link: "/category/lotions"
    },
    {
      id: "3",
      url: heroCremes,
      title: "Anti-Aging Crèmes",
      subtitle: "Turn back time with our advanced formulations",
      link: "/category/cremes"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={handleSearch} />
      
      <main>
        {/* Hero Slider */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <MegaSlider slides={heroSlides} />
        </section>

        {/* Category Menu */}
        <CategoryMenu 
          categories={productsData.categories}
          activeCategory={activeCategory}
          onCategorySelect={handleCategorySelect}
        />

        {/* Product Sections */}
        <div className="bg-muted/30">
          {searchQuery ? (
            /* Search Results */
            <div className="py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    Search Results for{searchQuery}
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                      <div key={product.id}>
                        <ProductCard 
                          product={product} 
                          onProductClick={handleProductClick}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-lg font-medium mb-2">No products found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search terms or browse our categories
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : activeCategory ? (
            /* Category Results */
            <div className="py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    {productsData.categories.find(cat => cat.id === activeCategory)?.name}
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    {productsData.categories.find(cat => cat.id === activeCategory)?.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {getProductsByCategory(activeCategory).map((product) => (
                    <div key={product.id}>
                      <ProductCard 
                        product={product} 
                        onProductClick={handleProductClick}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* All Categories */
            <>
              {productsData.categories.map((category) => {
                const categoryProducts = getProductsByCategory(category.id);
                if (categoryProducts.length === 0) return null;
                
                return (
                  <ProductRow
                    key={category.id}
                    title={category.name}
                    subtitle={category.description}
                    products={categoryProducts}
                    onProductClick={handleProductClick}
                  />
                );
              })}
            </>
          )}
        </div>

        {/* About Section */}
        <section className="py-16 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Why Choose Cosmetics?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="text-4xl">✨</div>
                <h3 className="text-xl font-semibold">Premium Quality</h3>
                <p className="text-muted-foreground">
                  Curated selection of high-quality cosmetics from trusted brands and suppliers.
                </p>
              </div>
              <div className="space-y-4">
                <div className="text-4xl">🚚</div>
                <h3 className="text-xl font-semibold">Fast Delivery</h3>
                <p className="text-muted-foreground">
                  Quick and secure shipping to get your beauty products delivered safely.
                </p>
              </div>
              <div className="space-y-4">
                <div className="text-4xl">💝</div>
                <h3 className="text-xl font-semibold">Best Prices</h3>
                <p className="text-muted-foreground">
                  Competitive pricing and exclusive deals on your favorite cosmetic products.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default HomePage;