'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ProductCard from '@/components/productCard';
import { Droplets } from 'lucide-react';
import { getOurCollection, CollectionItem } from '@/lib/ourcollection';

export default function OurCollectionPage() {
  const [products, setProducts] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadProducts() {
      try {
        const data = await getOurCollection();
        if (mounted) {
          setProducts(data);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    loadProducts();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-pure-white text-deep-navy selection:bg-soft-aqua selection:text-deep-navy">
      <Header />

      <main className="flex-1 bg-soft-aqua/40 py-10 sm:py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Heading */}
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 md:mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pure-white border border-pale-blue-gray mb-3 shadow-xs">
              <Droplets className="w-3.5 h-3.5 text-aqua-teal" />
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-deep-navy">
                Complete Product Lineup
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-deep-navy tracking-tight leading-tight">
              Our <span className="text-aqua-teal">Collection</span>
            </h1>

            <p className="mt-2.5 text-xs sm:text-sm md:text-base text-deep-navy/80 font-normal leading-relaxed">
              Explore all PlyAqua packaged drinking water products crafted for pure taste and balanced hydration.
            </p>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => (
                <div
                  key={idx}
                  className="aspect-[3/4] rounded-xl sm:rounded-2xl bg-pure-white/70 border-2 border-pale-blue-gray animate-pulse"
                />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="max-w-md mx-auto text-center rounded-2xl bg-pure-white border-2 border-pale-blue-gray p-10">
              <Droplets className="w-10 h-10 text-aqua-teal mx-auto mb-2" />
              <p className="text-base font-bold text-deep-navy">
                No products found
              </p>
              <p className="text-xs text-deep-navy/70 mt-1">
                Active products added to our catalog will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
              {products.map((item, index) => (
                <ProductCard key={item.id} item={item} index={index} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
