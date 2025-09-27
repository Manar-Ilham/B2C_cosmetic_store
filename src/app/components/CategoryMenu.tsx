import React from 'react';

interface Category {
  id: string;
  name: string;
  description: string;
}

interface CategoryMenuProps {
  categories: Category[];
  activeCategory?: string;
  onCategorySelect?: (categoryId: string) => void;
}

const CategoryMenu: React.FC<CategoryMenuProps> = ({ 
  categories, 
  activeCategory,
  onCategorySelect 
}) => {
  return (
    <div className="w-full bg-card border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto scrollbar-hide py-4 space-x-6 md:space-x-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect?.(category.id)}
              className={`flex-shrink-0 text-center group transition-all duration-200 ${
                activeCategory === category.id 
                  ? 'text-primary' 
                  : 'text-foreground hover:text-primary'
              }`}
            >
              <div className={`px-6 py-3 rounded-2xl border-2 transition-all duration-200 ${
                activeCategory === category.id
                  ? 'border-primary bg-primary/10'
                  : 'border-transparent hover:border-primary/50 hover:bg-primary/5'
              }`}>
                <h3 className="font-semibold text-lg whitespace-nowrap">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 whitespace-nowrap">
                  {category.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryMenu;