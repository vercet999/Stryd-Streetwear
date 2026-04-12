import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../services/woocommerce';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, X, ChevronDown, PanelRightClose, PanelRightOpen, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const categoryFilter = searchParams.get('category') || '';
  const brandFilter = searchParams.get('brand') || '';
  const colorFilter = searchParams.get('color') || '';
  const sizeFilter = searchParams.get('size') || '';
  const sortOrder = searchParams.get('sort') || '';
  const searchFilter = searchParams.get('search') || '';
  const [showAllBrands, setShowAllBrands] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);

      const newProducts = await getProducts(page, 10);
      
      if (newProducts.length < 10) {
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

    if (searchFilter) {
      const lowerSearch = searchFilter.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(lowerSearch));
    }

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
    if (sizeFilter) {
      result = result.filter(p => 
        p.attributes.some(attr => attr.name.toLowerCase() === 'size' && attr.options.some(opt => opt.toLowerCase() === sizeFilter.toLowerCase()))
      );
    }

    if (sortOrder === 'price-asc') {
      result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortOrder === 'price-desc') {
      result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (sortOrder === 'newest') {
      result.sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime());
    } else if (sortOrder === 'best-selling') {
      result.sort((a, b) => (b.total_sales || 0) - (a.total_sales || 0));
    }

    return result;
  }, [products, categoryFilter, brandFilter, colorFilter, sizeFilter, sortOrder, searchFilter]);

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
  
  const brandSales = useMemo(() => {
    const sales: Record<string, number> = {};
    products.forEach(p => {
      if (p.brands) {
        p.brands.forEach(b => {
          sales[b.slug] = (sales[b.slug] || 0) + (p.total_sales || 0);
        });
      }
    });
    return sales;
  }, [products]);

  const brands = useMemo(() => {
    const brandsSet = new Set(products.flatMap(p => p.brands?.map(b => b.slug) || []));
    return Array.from(brandsSet).sort((a, b) => (brandSales[b] || 0) - (brandSales[a] || 0));
  }, [products, brandSales]);

  const colors = Array.from(new Set(products.flatMap(p => 
    p.attributes.find(a => a.name === 'Color')?.options || []
  ))) as string[];

  const sizes = Array.from(new Set(products.flatMap(p => 
    p.attributes.find(a => a.name.toLowerCase() === 'size')?.options || []
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
    <div className="space-y-2 w-full lg:w-60">
      {/* Sort */}
      <details className="group border-b border-primary/10 pb-4" open>
        <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-bold uppercase tracking-widest mb-4 [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-2">
            Sort By
            {sortOrder && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
          </span>
          <ChevronDown size={16} className="transition-transform group-open:rotate-180 text-primary/40 group-hover:text-primary" />
        </summary>
        <div className="space-y-3">
          {[
            { value: '', label: 'Featured' },
            { value: 'newest', label: 'Newest Arrivals' },
            { value: 'best-selling', label: 'Best Selling' },
            { value: 'price-asc', label: 'Price: Low to High' },
            { value: 'price-desc', label: 'Price: High to Low' },
          ].map(option => (
            <button
              key={option.value}
              onClick={() => updateFilter('sort', option.value)}
              className={`block w-full text-left text-sm transition-colors ${sortOrder === option.value ? 'font-bold text-primary' : 'text-primary/60 hover:text-primary'}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </details>

      {/* Categories */}
      {categories.length > 0 && (
        <details className="group border-b border-primary/10 py-4" open>
          <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-bold uppercase tracking-widest mb-4 [&::-webkit-details-marker]:hidden">
            <span className="flex items-center gap-2">
              Category
              {categoryFilter && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
            </span>
            <ChevronDown size={16} className="transition-transform group-open:rotate-180 text-primary/40 group-hover:text-primary" />
          </summary>
          <div className="space-y-3">
            <button
              onClick={() => updateFilter('category', '')}
              className={`block w-full text-left text-sm transition-colors ${categoryFilter === '' ? 'font-bold text-primary' : 'text-primary/60 hover:text-primary'}`}
            >
              All Categories
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => updateFilter('category', cat)}
                className={`block w-full text-left text-sm capitalize transition-colors ${categoryFilter === cat ? 'font-bold text-primary' : 'text-primary/60 hover:text-primary'}`}
              >
                {cat.replace('-', ' ')}
              </button>
            ))}
          </div>
        </details>
      )}

      {/* Brands */}
      {brands.length > 0 && (
        <details className="group border-b border-primary/10 py-4" open>
          <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-bold uppercase tracking-widest mb-4 [&::-webkit-details-marker]:hidden">
            <span className="flex items-center gap-2">
              Brand
              {brandFilter && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
            </span>
            <ChevronDown size={16} className="transition-transform group-open:rotate-180 text-primary/40 group-hover:text-primary" />
          </summary>
          <div className="space-y-3">
            <button
              onClick={() => updateFilter('brand', '')}
              className={`block w-full text-left text-sm transition-colors ${brandFilter === '' ? 'font-bold text-primary' : 'text-primary/60 hover:text-primary'}`}
            >
              All Brands
            </button>
            {(showAllBrands ? brands : brands.slice(0, 5)).map(brand => (
              <button
                key={brand}
                onClick={() => updateFilter('brand', brand)}
                className={`block w-full text-left text-sm capitalize transition-colors ${brandFilter === brand ? 'font-bold text-primary' : 'text-primary/60 hover:text-primary'}`}
              >
                {brand.replace('-', ' ')}
              </button>
            ))}
            {brands.length > 5 && (
              <button
                onClick={() => setShowAllBrands(!showAllBrands)}
                className="block w-full text-left text-xs font-bold uppercase tracking-widest text-primary/40 hover:text-primary transition-colors pt-2"
              >
                {showAllBrands ? 'View Less' : 'View All'}
              </button>
            )}
          </div>
        </details>
      )}

      {/* Colors */}
      {colors.length > 0 && (
        <details className="group py-4" open>
          <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-bold uppercase tracking-widest mb-4 [&::-webkit-details-marker]:hidden">
            <span className="flex items-center gap-2">
              Color
              {colorFilter && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
            </span>
            <ChevronDown size={16} className="transition-transform group-open:rotate-180 text-primary/40 group-hover:text-primary" />
          </summary>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateFilter('color', '')}
              className={`px-3 py-1.5 text-xs border ${colorFilter === '' ? 'bg-primary text-base border-primary font-bold' : 'border-primary/20 hover:border-primary text-primary/60 hover:text-primary'} transition-colors`}
            >
              All
            </button>
            {colors.map(color => (
              <button
                key={color}
                onClick={() => updateFilter('color', color)}
                className={`px-3 py-1.5 text-xs border ${colorFilter.toLowerCase() === color.toLowerCase() ? 'bg-primary text-base border-primary font-bold' : 'border-primary/20 hover:border-primary text-primary/60 hover:text-primary'} transition-colors`}
              >
                {color}
              </button>
            ))}
          </div>
        </details>
      )}

      {/* Sizes */}
      {sizes.length > 0 && (
        <details className="group py-4" open>
          <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-bold uppercase tracking-widest mb-4 [&::-webkit-details-marker]:hidden">
            <span className="flex items-center gap-2">
              Size
              {sizeFilter && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
            </span>
            <ChevronDown size={16} className="transition-transform group-open:rotate-180 text-primary/40 group-hover:text-primary" />
          </summary>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateFilter('size', '')}
              className={`px-3 py-1.5 text-xs border ${sizeFilter === '' ? 'bg-primary text-base border-primary font-bold' : 'border-primary/20 hover:border-primary text-primary/60 hover:text-primary'} transition-colors`}
            >
              All
            </button>
            {sizes.map(size => (
              <button
                key={size}
                onClick={() => updateFilter('size', size)}
                className={`px-3 py-1.5 text-xs border ${sizeFilter.toLowerCase() === size.toLowerCase() ? 'bg-primary text-base border-primary font-bold' : 'border-primary/20 hover:border-primary text-primary/60 hover:text-primary'} transition-colors`}
              >
                {size}
              </button>
            ))}
          </div>
        </details>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary/40 mb-4 flex-wrap">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight size={14} />
        <span className="text-primary">Shop</span>
      </nav>

      <header className="space-y-4">
        <h1 className="text-5xl font-display font-black tracking-tighter uppercase">
          {categoryFilter ? categoryFilter.replace('-', ' ') : 'All Footwear'}
        </h1>
        <div className="flex items-center justify-between">
          <p className="text-sm text-primary/60 uppercase tracking-widest">
            {filteredProducts.length} Pairs
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center text-primary hover:text-accent transition-colors lg:hidden"
              title="Filters & Sort"
            >
              <Filter size={18} />
            </button>
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:flex items-center justify-center text-primary hover:text-accent transition-colors"
              title={isSidebarCollapsed ? "Show Filters" : "Hide Filters"}
            >
              {isSidebarCollapsed ? <PanelRightOpen size={18} /> : <PanelRightClose size={18} />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="min-h-[50vh] flex items-center justify-center">
              <LoadingSpinner className="w-14 h-14" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
                {filteredProducts.map((product, index) => {
                  const triggerIndex = Math.max(0, filteredProducts.length - 5);
                  if (index === triggerIndex) {
                    return (
                      <div ref={lastProductElementRef} key={product.id}>
                        <ProductCard product={product} onQuickView={setQuickViewProduct} />
                      </div>
                    );
                  } else {
                    return <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />;
                  }
                })}
              </div>
              {loadingMore && (
                <div className="py-12 flex justify-center">
                  <LoadingSpinner className="w-8 h-8" />
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
        <div className={`hidden lg:block ${isSidebarCollapsed ? 'lg:w-0 lg:pl-0 lg:opacity-0 lg:overflow-hidden' : 'lg:w-64 lg:pl-4 lg:opacity-100'} transition-all duration-300 ease-in-out flex-shrink-0 lg:sticky lg:top-24 h-fit max-h-[calc(100vh-6rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}>
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
                <div className="p-6 overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <FilterContent />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <QuickViewModal 
            product={quickViewProduct} 
            onClose={() => setQuickViewProduct(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
