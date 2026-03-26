import { getProductByHandle, getRecommendedProducts } from '@/lib/shopify';
import { notFound } from 'next/navigation';

export default async function ProductPage({ params }) {
  const { handle } = await params;
  
  // Adatok lekérése a lib-en keresztül
  const product = await getProductByHandle(handle);
  
  if (!product) {
    notFound();
  }

  // Ajánlások lekérése (átadjuk a termék ID-t, ha később szűrni akarunk)
  const recommendations = await getRecommendedProducts(product.id);

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-20">
        
        {/* FŐ TERMÉK RÉSZ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32">
          {/* Kép Galéria */}
          <div className="rounded-[40px] overflow-hidden bg-[#fce4ec]/20 border border-[#fce4ec]/50 shadow-sm">
            <img 
              src={product.images.nodes[0]?.url} 
              alt={product.title} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
            />
          </div>
          
          {/* Termék Adatok */}
          <div className="flex flex-col justify-center space-y-8">
            <div>
              <h1 className="text-5xl font-black text-[#5d4037] mb-4 tracking-tighter uppercase italic">
                {product.title}
              </h1>
              <div className="inline-block px-6 py-2 bg-[#fce4ec] rounded-full">
                <p className="text-2xl text-[#ad1457] font-black">
                  {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
                </p>
              </div>
            </div>

            <div 
              className="prose prose-stone text-lg text-[#5d4037]/80 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} 
            />

            <button className="w-full md:w-max bg-[#ad1457] text-white px-12 py-5 rounded-full font-black uppercase tracking-widest shadow-[0_20px_50px_rgba(173,20,87,0.2)] hover:bg-[#880e4f] hover:-translate-y-1 transition-all active:scale-95">
              Kosárba teszem
            </button>
          </div>
        </div>

        {/* AJÁNLOTT TERMÉKEK (Recommended Section) */}
        <section className="border-t border-[#fce4ec] pt-20">
          <h2 className="text-3xl font-black text-[#5d4037] mb-12 text-center uppercase tracking-widest">
            Ezeket is imádni fogod
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {recommendations.map((item) => (
              <a 
                key={item.id} 
                href={`/product/${item.handle}`} 
                className="group space-y-4"
              >
                <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-gray-50 border border-gray-100">
                  <img 
                    src={item.images.nodes[0]?.url} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    alt={item.title}
                  />
                </div>
                <div className="px-2">
                  <p className="font-bold text-[#5d4037] group-hover:text-[#ad1457] transition-colors line-clamp-1">
                    {item.title}
                  </p>
                  <p className="text-[#ad1457] font-black text-sm">
                    {item.priceRange.minVariantPrice.amount} {item.priceRange.minVariantPrice.currencyCode}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}