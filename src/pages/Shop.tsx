import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../services/woocommerce';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, X, ChevronDown, PanelRightClose, PanelRightOpen } from 'lucide-react';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const categoryFilter = searchParams.get('category') || '';
  const brandFilter = searchParams.get('brand') || '';
  const colorFilter = searchParams.get('color') || '';
  const sortOrder = searchParams.get('sort') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);

      const newProducts = await getProducts(page, 20);
      
      if (newProducts.length < 20) {
        setHasMore(false);
      }

      setProducts(prev => {
        if (page === 1) return newProducts;
        const existingIds = new Set(prev.map(p => p.id));
        const uniqueNew = newProducts.filter(p => !existingIds.has(p.id));
        return [...prev, ...uniqueNew];
      });

      setLoading(false);
      setLoadingMore(false);
    };

    fetchProducts();
  }, [page]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (categoryFilter) {
      result = result.filter(p => p.categories.some(c => c.slug === categoryFilter));
    }
    if (brandFilter) {
      result = result.filter(p => p.brands?.some(b => b.slug === brandFilter));
    }
    if (colorFilter) {
      result = result.filter(p => 
        p.attributes.some(attr => attr.name === 'Color' && attr.options.some(opt => opt.toLowerCase() === colorFilter.toLowerCase()))
      );
    }

    if (sortOrder === 'price-asc') {
      result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortOrder === 'price-desc') {
      result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }

    return result;
  }, [products, categoryFilter, brandFilter, colorFilter, sortOrder]);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const categories = Array.from(new Set(products.flatMap(p => p.categories.map(c => c.slug)))) as string[];
  const brands = Array.from(new Set(products.flatMap(p => p.brands?.map(b => b.slug) || []))) as string[];
  const colors = Array.from(new Set(products.flatMap(p => 
    p.attributes.find(a => a.name === 'Color')?.options || []
  ))) as string[];

  const lastProductElementRef = useCallback((node: HTMLDivElement) => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);

  const FilterContent = () => (
    <div className="space-y-6 w-full lg:w-60">
      {/* Sort */}
      <details className="group" open>
        <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-bold uppercase tracking-widest mb-3 [&::-webkit-details-marker]:hidden">
          Sort By
          <ChevronDown size={16} className="transition-transform group-open:rotate-180" />
        </summary>
        <select 
          value={sortOrder}
          onChange={(e) => updateFilter('sort', e.target.value)}
          className="w-full p-2 border border-primary/20 bg-transparent text-sm focus:outline-none focus:border-primary"
        >
          <option value="">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </details>

      {/* Categories */}
      {categories.length > 0 && (
        <details className="group" open>
          <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-bold uppercase tracking-widest mb-3 [&::-webkit-details-marker]:hidden">
            Category
            <ChevronDown size={16} className="transition-transform group-open:rotate-180" />
          </summary>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="category" 
                checked={categoryFilter === ''}
                onChange={() => updateFilter('category', '')}
                className="accent-primary"
              />
              <span className="text-sm">All Categories</span>
            </label>
            {categories.map(cat => (
              <label key={cat} className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="category" 
                  checked={categoryFilter === cat}
                  onChange={() => updateFilter('category', cat)}
                  className="accent-primary"
                />
                <span className="text-sm capitalize">{cat.replace('-', ' ')}</span>
              </label>
            ))}
          </div>
        </details>
      )}

      {/* Brands */}
      {brands.length > 0 && (
        <details className="group" open>
          <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-bold uppercase tracking-widest mb-3 [&::-webkit-details-marker]:hidden">
            Brand
            <ChevronDown size={16} className="transition-transform group-open:rotate-180" />
          </summary>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="brand" 
                checked={brandFilter === ''}
                onChange={() => updateFilter('brand', '')}
                className="accent-primary"
              />
              <span className="text-sm">All Brands</span>
            </label>
            {brands.map(brand => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="brand" 
                  checked={brandFilter === brand}
                  onChange={() => updateFilter('brand', brand)}
                  className="accent-primary"
                />
                <span className="text-sm capitalize">{brand.replace('-', ' ')}</span>
              </label>
            ))}
          </div>
        </details>
      )}

      {/* Colors */}
      {colors.length > 0 && (
        <details className="group" open>
          <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-bold uppercase tracking-widest mb-3 [&::-webkit-details-marker]:hidden">
            Color
            <ChevronDown size={16} className="transition-transform group-open:rotate-180" />
          </summary>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateFilter('color', '')}
              className={`px-3 py-1 text-xs border ${colorFilter === '' ? 'bg-primary text-base border-primary' : 'border-primary/20 hover:border-primary'} transition-colors`}
            >
              All
            </button>
            {colors.map(color => (
              <button
                key={color}
                onClick={() => updateFilter('color', color)}
                className={`px-3 py-1 text-xs border ${colorFilter.toLowerCase() === color.toLowerCase() ? 'bg-primary text-base border-primary' : 'border-primary/20 hover:border-primary'} transition-colors`}
              >
                {color}
              </button>
            ))}
          </div>
        </details>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <header className="space-y-4">
        <h1 className="text-5xl font-display font-black tracking-tighter uppercase">
          {categoryFilter ? categoryFilter.replace('-', ' ') : 'All Footwear'}
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-sm text-primary/60 uppercase tracking-widest">
            {filteredProducts.length} Products Found
          </p>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-accent transition-colors lg:hidden"
            >
              <Filter size={16} />
              Filters & Sort
            </button>
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:flex items-center justify-center text-sm font-bold uppercase tracking-widest hover:text-accent transition-colors"
              title={isSidebarCollapsed ? "Show Filters" : "Hide Filters"}
            >
              {isSidebarCollapsed ? <PanelRightOpen size={20} /> : <PanelRightClose size={20} />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="space-y-4 animate-pulse">
                  <div className="aspect-square bg-primary/5 rounded-[5px]" />
                  <div className="h-4 bg-primary/5 w-3/4" />
                  <div className="h-4 bg-primary/5 w-1/4" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
                {filteredProducts.map((product, index) => {
                  if (filteredProducts.length === index + 1) {
                    return (
                      <div ref={lastProductElementRef} key={product.id}>
                        <ProductCard product={product} />
                      </div>
                    );
                  } else {
                    return <ProductCard key={product.id} product={product} />;
                  }
                })}
              </div>
              {loadingMore && (
                <div className="py-12 flex justify-center">
                  <div className="animate-pulse flex space-x-2">
                    <div className="h-2 w-2 bg-primary rounded-full"></div>
                    <div className="h-2 w-2 bg-primary rounded-full"></div>
                    <div className="h-2 w-2 bg-primary rounded-full"></div>
                  </div>
                </div>
              )}
            </>
          )}

          {filteredProducts.length === 0 && !loading && (
            <div className="py-24 text-center space-y-4">
              <p className="text-xl font-medium uppercase tracking-widest opacity-40">No products found matching your filters.</p>
              <button 
                onClick={() => {
                  setSearchParams(new URLSearchParams());
                }}
                className="text-sm font-bold uppercase tracking-widest underline underline-offset-4"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Desktop Filters Sidebar */}
        <div className={`hidden lg:block ${isSidebarCollapsed ? 'lg:w-0 lg:pl-0 lg:opacity-0 lg:overflow-hidden' : 'lg:w-64 lg:pl-4 lg:opacity-100'} transition-all duration-300 ease-in-out flex-shrink-0 lg:sticky lg:top-24 h-fit max-h-[calc(100vh-6rem)] overflow-y-auto`}>
          <FilterContent />
        </div>

        {/* Mobile Filters Sidebar */}
        <AnimatePresence>
          {showFilters && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowFilters(false)}
                className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-50 lg:hidden"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 right-0 w-full max-w-md bg-base shadow-2xl z-50 flex flex-col lg:hidden"
              >
                <div className="flex items-center justify-between p-6 border-b border-primary/10">
                  <h2 className="text-xl font-display font-black tracking-tighter uppercase">Filters & Sort</h2>
                  <button 
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-primary/5 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-6 overflow-y-auto flex-1">
                  <FilterContent />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
