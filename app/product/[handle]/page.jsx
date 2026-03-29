import { getProductByHandle, getRecommendedProducts } from '@/lib/shopify';
import { notFound } from 'next/navigation';
import Header from '@/components/Header'; // Feltételezve, hogy itt van a Header

export default async function ProductPage({ params }) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  
  if (!product) notFound();

  const recommendations = await getRecommendedProducts(product.id);

  return (
    <main className="bg-[#fffafb] min-h-screen">
      {/* HEADER INTEGRÁCIÓ - Átadjuk a propokat (ezeket érdemes egy Context-be tenni később) */}
      <Header totalItems={0} />

      <div className="max-w-7xl mx-auto px-6 pt-40 pb-20">
        
        {/* FŐ TERMÉK RÉSZ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-32 items-start">
          
          {/* Kép Galéria - Prémium kerettel */}
          <div className="sticky top-40 space-y-4">
            <div className="aspect-square rounded-[60px] overflow-hidden bg-white border-8 border-white shadow-[0_30px_100px_rgba(173,20,87,0.08)]">
              <img 
                src={product.images.nodes[0]?.url} 
                alt={product.title} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" 
              />
            </div>
            {/* Kis galéria képek (opcionális) */}
            <div className="flex gap-4 px-2">
               {product.images.nodes.slice(1).map((img, i) => (
                 <div key={i} className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
                   <img src={img.url} className="w-full h-full object-cover" />
                 </div>
               ))}
            </div>
          </div>
          
          {/* Termék Adatok */}
          <div className="flex flex-col pt-8">
            <div className="mb-10">
              <span className="text-[#ad1457] font-black text-xs uppercase tracking-[0.3em] mb-4 block">Kézzel készült álom</span>
              <h1 className="text-5xl md:text-6xl font-black text-[#5d4037] mb-6 tracking-tighter leading-tight italic">
                {product.title}
              </h1>
              <div className="flex items-center gap-6">
                <span className="text-3xl text-[#ad1457] font-black">
                  {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
                </span>
                <div className="h-1 w-12 bg-[#fce4ec] rounded-full" />
                <span className="text-sm text-[#5d4037]/40 font-bold uppercase tracking-widest">Készleten</span>
              </div>
            </div>

            <div 
              className="prose prose-stone text-lg text-[#5d4037]/70 leading-relaxed mb-12"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} 
            />

            {/* INTERAKTÍV RÉSZ: Mennyiség és Kosár */}
            <div className="flex flex-col sm:flex-row items-center gap-4 p-2 bg-white/50 backdrop-blur-md rounded-[40px] border border-white shadow-xl max-w-fit">
              {/* Mennyiségválasztó */}
              <div className="flex items-center bg-[#fce4ec]/40 rounded-full px-4 py-2 border border-[#fce4ec]">
                <button className="w-10 h-10 flex items-center justify-center text-[#ad1457] font-bold hover:scale-125 transition-transform">-</button>
                <input type="number" defaultValue="1" className="w-12 bg-transparent text-center font-black text-[#5d4037] border-none focus:ring-0" />
                <button className="w-10 h-10 flex items-center justify-center text-[#ad1457] font-bold hover:scale-125 transition-transform">+</button>
              </div>

              {/* Kosár gomb */}
              <button className="bg-[#ad1457] text-white px-10 py-5 rounded-full font-black uppercase tracking-widest shadow-lg shadow-[#ad1457]/20 hover:bg-[#880e4f] hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                Kosárba teszem
              </button>
            </div>
          </div>
        </div>

        {/* AJÁNLOTT TERMÉKEK */}
        <section className="relative mt-20">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-[#fce4ec] to-transparent" />
          <h2 className="text-3xl font-black text-[#5d4037] pt-28 mb-16 text-center uppercase tracking-[0.2em]">
            Ezeket is imádni fogod
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {recommendations.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

// Egy kis segédkomponens a kártyákhoz
function ProductCard({ product }) {
  return (
    <a href={`/product/${product.handle}`} className="group">
      <div className="aspect-[4/5] rounded-[32px] overflow-hidden bg-white border border-[#fce4ec]/30 shadow-sm mb-4 relative">
        <img 
          src={product.images.nodes[0]?.url} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          alt={product.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#ad1457]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="px-2 text-center">
        <p className="font-bold text-[#5d4037] group-hover:text-[#ad1457] transition-colors line-clamp-1 uppercase text-xs tracking-widest">
          {product.title}
        </p>
        <p className="text-[#ad1457] font-black mt-1">
          {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
        </p>
      </div>
    </a>
  );
}