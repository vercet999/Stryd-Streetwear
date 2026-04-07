import { Product } from '../types';

// Mock data for development if API keys are missing
const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "STRYD Model 01 – Deep Green",
    slug: "stryd-model-01-deep-green",
    permalink: "",
    date_created: "2024-01-01",
    type: "simple",
    status: "publish",
    featured: true,
    catalog_visibility: "visible",
    description: "<p>The STRYD Model 01 is our flagship streetwear sneaker. Built for the urban explorer, it combines a minimal aesthetic with daily comfort. The deep green accent adds a subtle pop of color to your rotation.</p>",
    short_description: "Clean. Daily. Built for movement.",
    sku: "STRYD-01-DG",
    price: "89.00",
    regular_price: "89.00",
    sale_price: "",
    on_sale: false,
    purchasable: true,
    stock_status: "instock",
    total_sales: 150,
    virtual: false,
    downloadable: false,
    categories: [{ id: 1, name: "Signature", slug: "signature" }],
    brands: [{ id: 1, name: "STRYD", slug: "stryd" }],
    images: [
      {
        id: 1,
        date_created: "2024-01-01",
        src: "https://stryd.visoirejewels.com/wp-content/uploads/2026/04/stryd-model-01.webp",
        name: "STRYD Model 01",
        alt: "STRYD Model 01 Deep Green"
      },
      {
        id: 11,
        date_created: "2024-01-01",
        src: "https://stryd.visoirejewels.com/wp-content/uploads/2026/04/stryd-model-01.webp", // Using the same placeholder for now, but it will trigger the hover effect
        name: "STRYD Model 01 Alternate",
        alt: "STRYD Model 01 Deep Green Alternate"
      }
    ],
    attributes: [
      { id: 1, name: "Size", position: 0, visible: true, variation: true, options: ["39", "40", "41", "42", "43", "44"] },
      { id: 2, name: "Color", position: 1, visible: true, variation: true, options: ["Green"] }
    ]
  },
  {
    id: 2,
    name: "STRYD Core – Stealth Black",
    slug: "stryd-core-stealth-black",
    permalink: "",
    date_created: "2024-01-02",
    type: "simple",
    status: "publish",
    featured: true,
    catalog_visibility: "visible",
    description: "<p>All black, all business. The STRYD Core is the essential streetwear staple. Durable materials and a sleek profile make it perfect for any fit.</p>",
    short_description: "The essential streetwear staple.",
    sku: "STRYD-CORE-SB",
    price: "75.00",
    regular_price: "75.00",
    sale_price: "",
    on_sale: false,
    purchasable: true,
    stock_status: "instock",
    total_sales: 320,
    virtual: false,
    downloadable: false,
    categories: [{ id: 2, name: "Street Core", slug: "street-core" }],
    brands: [{ id: 1, name: "STRYD", slug: "stryd" }],
    images: [
      {
        id: 2,
        date_created: "2024-01-02",
        src: "https://stryd.visoirejewels.com/wp-content/uploads/2026/04/stryd-model-01.webp",
        name: "STRYD Core",
        alt: "STRYD Core Stealth Black"
      }
    ],
    attributes: [
      { id: 1, name: "Size", position: 0, visible: true, variation: true, options: ["39", "40", "41", "42", "43", "44"] },
      { id: 2, name: "Color", position: 1, visible: true, variation: true, options: ["Black"] }
    ]
  },
  {
    id: 3,
    name: "STRYD Comfort – Cloud White",
    slug: "stryd-comfort-cloud-white",
    permalink: "",
    date_created: "2024-01-03",
    type: "simple",
    status: "publish",
    featured: true,
    catalog_visibility: "visible",
    description: "<p>Engineered for all-day wear. The STRYD Comfort features a breathable upper and cushioned sole that feels like walking on clouds.</p>",
    short_description: "Daily streetwear footwear. Clean. Affordable.",
    sku: "STRYD-COMF-CW",
    price: "69.00",
    regular_price: "69.00",
    sale_price: "",
    on_sale: false,
    purchasable: true,
    stock_status: "outofstock",
    total_sales: 210,
    virtual: false,
    downloadable: false,
    categories: [{ id: 3, name: "Daily Comfort", slug: "daily-comfort" }],
    brands: [{ id: 1, name: "STRYD", slug: "stryd" }],
    images: [
      {
        id: 3,
        date_created: "2024-01-03",
        src: "https://stryd.visoirejewels.com/wp-content/uploads/2026/04/stryd-model-01.webp",
        name: "STRYD Comfort",
        alt: "STRYD Comfort Cloud White"
      }
    ],
    attributes: [
      { id: 1, name: "Size", position: 0, visible: true, variation: true, options: ["39", "40", "41", "42", "43", "44"] },
      { id: 2, name: "Color", position: 1, visible: true, variation: true, options: ["White"] }
    ]
  },
  {
    id: 4,
    name: "STRYD Model 02 – Ash Grey",
    slug: "stryd-model-02-ash-grey",
    permalink: "",
    date_created: "2024-01-04",
    type: "simple",
    status: "publish",
    featured: true,
    catalog_visibility: "visible",
    description: "<p>A refined take on the classic streetwear silhouette. The Ash Grey colorway offers versatility for any style.</p>",
    short_description: "Clean. Daily. Built for movement.",
    sku: "STRYD-02-AG",
    price: "85.00",
    regular_price: "85.00",
    sale_price: "",
    on_sale: false,
    purchasable: true,
    stock_status: "instock",
    total_sales: 85,
    virtual: false,
    downloadable: false,
    categories: [{ id: 1, name: "Signature", slug: "signature" }],
    brands: [{ id: 1, name: "STRYD", slug: "stryd" }],
    images: [
      {
        id: 4,
        date_created: "2024-01-04",
        src: "https://stryd.visoirejewels.com/wp-content/uploads/2026/04/stryd-model-01.webp",
        name: "STRYD Model 02",
        alt: "STRYD Model 02 Ash Grey"
      }
    ],
    attributes: [
      { id: 1, name: "Size", position: 0, visible: true, variation: true, options: ["39", "40", "41", "42", "43", "44"] },
      { id: 2, name: "Color", position: 1, visible: true, variation: true, options: ["Grey"] }
    ]
  }
];

export async function getProducts(page: number = 1, per_page: number = 20): Promise<Product[]> {
  try {
    const response = await fetch(`/api/products?page=${page}&per_page=${per_page}`);
    
    if (!response.ok) {
      console.warn('Backend API failed or missing credentials. Using mock data.');
      return MOCK_PRODUCTS;
    }

    const data = await response.json();
    if (data.error) {
      console.warn('Backend API error:', data.error);
      return MOCK_PRODUCTS;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return MOCK_PRODUCTS;
  }
}

export async function searchAllProducts(query: string): Promise<Product[]> {
  // Fetch a larger batch of products for client-side searching
  // In a real app with thousands of products, this would be handled by a dedicated search backend (like Algolia or ElasticSearch)
  const allProducts = await getProducts(1, 100);
  
  if (!query) return [];
  
  const lowerQuery = query.toLowerCase();
  
  return allProducts.filter(product => {
    // Match Name
    if (product.name.toLowerCase().includes(lowerQuery)) return true;
    
    // Match Description
    if (product.description?.toLowerCase().includes(lowerQuery)) return true;
    if (product.short_description?.toLowerCase().includes(lowerQuery)) return true;
    
    // Match Categories
    if (product.categories?.some(c => c.name.toLowerCase().includes(lowerQuery))) return true;
    
    // Match Brands
    if (product.brands?.some(b => b.name.toLowerCase().includes(lowerQuery))) return true;
    
    // Match Attributes (e.g., Color, Size)
    if (product.attributes?.some(attr => 
      attr.name.toLowerCase().includes(lowerQuery) || 
      attr.options.some(opt => opt.toLowerCase().includes(lowerQuery))
    )) return true;
    
    return false;
  });
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find(p => p.slug === slug);
}
