'use client';

import { useState, useEffect, useRef } from 'react';

export default function Header({ totalItems, onCartOpen, onProfileOpen }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState({ products: [], collections: [] });
  const [isLoading, setIsLoading] = useState(false);
  const logoRef = useRef(null);

  // Görgetés figyelése
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // PREDIKTÍV KERESÉS LOGIKA
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setIsLoading(true);
        try {
          const res = await fetch('/api/search', {
            method: 'POST',
            body: JSON.stringify({ query: searchQuery }),
          });
          const data = await res.json();
          setResults(data);
        } catch (err) {
          console.error("Search error:", err);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults({ products: [], collections: [] });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Magnetikus Logo Effekt (Finomítva)
  const handleLogoHover = (e) => {
    if (!logoRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = logoRef.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.12;
    const y = (clientY - (top + height / 2)) * 0.12;
    logoRef.current.style.transform = `translate(${x}px, ${y}px)`;
  };

  return (
    <>
      {/* KERESŐ MODAL - Puhább, lágyabb design */}
      <div className={`fixed inset-0 z-[60] transition-all duration-700 ${searchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-[#5d4037]/20 backdrop-blur-3xl" onClick={() => setSearchOpen(false)} />
        
        <div className="relative max-w-2xl mx-auto mt-16 px-6">
          <div className="bg-white/95 rounded-[36px] shadow-[0_25px_60px_-15px_rgba(173,20,87,0.1)] border border-white/30 overflow-hidden">
            {/* Input rész */}
            <div className="p-7 flex items-center gap-5 border-b border-[#fce4ec]/50">
              <svg className="w-6 h-6 text-[#ad1457]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input 
                type="text"
                placeholder="Mit keresel a kicsinek?..."
                className="w-full bg-transparent border-none focus:ring-0 text-lg font-bold text-[#5d4037] placeholder-[#ad1457]/30 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {isLoading && <div className="w-5 h-5 border-2 border-[#ad1457] border-t-transparent rounded-full animate-spin" />}
            </div>

            {/* Eredmények lista */}
            <div className="max-h-[60vh] overflow-y-auto p-6 space-y-6">
              {results.products?.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ad1457]/50 mb-4 px-2">Termékek</h3>
                  <div className="grid gap-3">
                    {results.products.map(product => (
                      <a key={product.id} href={`/product/${product.handle}`} className="flex items-center gap-4 p-2 hover:bg-[#fce4ec]/20 rounded-2xl transition-all group">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50">
                          <img src={product.images.nodes[0]?.url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#5d4037]">{product.title}</p>
                          <p className="text-xs text-[#ad1457]">{product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {results.collections?.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ad1457]/50 mb-4 px-2">Kollekciók</h3>
                  <div className="flex flex-wrap gap-2">
                    {results.collections.map(col => (
                      <a key={col.handle} href={`/collections/${col.handle}`} className="px-4 py-2 bg-[#fce4ec]/30 hover:bg-[#ad1457] hover:text-white rounded-full text-xs font-bold text-[#ad1457] transition-all">
                        {col.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {searchQuery.length > 2 && !isLoading && results?.products?.length === 0 && (
                <div className="text-center py-10 text-[#5d4037]/40 italic font-medium">Sajnos nem találtunk semmit...</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* HEADER - Magas, lágy vonalak */}
      <header className={`fixed top-0 left-0 right-0 z-[50] transition-all duration-1000 ease-in-out ${
        isScrolled ? 'py-3 bg-white/60 backdrop-blur-xl border-b border-white/20' : 'py-9 bg-transparent'
      }`}>
        <div className="max-w-[1440px] mx-auto px-10 md:px-16 flex justify-between items-center gap-12">
          
          <div className="flex items-center gap-16">
            <div 
              ref={logoRef}
              className="flex flex-col group cursor-pointer shrink-0 transition-transform duration-500 ease-out"
              onMouseMove={handleLogoHover}
              onMouseLeave={() => logoRef.current.style.transform = 'translate(0,0)'}
            >
              <h1 className={`font-black tracking-tighter text-[#ad1457] italic transition-all duration-500 ${isScrolled ? 'text-2xl md:text-3xl' : 'text-3xl md:text-5xl'}`}>
                MINI<span className="text-[#f06292]">DREAMS</span>
              </h1>
              <div className={`h-1.5 bg-[#fce4ec] rounded-full mt-1.5 transition-all duration-500 ${isScrolled ? 'w-10' : 'w-20 group-hover:w-32'}`} />
            </div>

            <nav className="hidden lg:flex items-center gap-12">
              {['Kezdőlap', 'Kollekciók', 'Rólunk'].map((item) => (
                <a key={item} href="#" className="text-[12px] font-extrabold uppercase tracking-[0.25em] text-[#5d4037] hover:text-[#ad1457] transition-all relative group">
                  {item}
                  <span className="absolute -bottom-2.5 left-0 w-full h-0.5 bg-[#ad1457] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-500" />
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4 md:gap-8 flex-1 justify-end">
            <div className="flex items-center gap-2">
              <button onClick={() => setSearchOpen(true)} className="w-12 h-12 flex items-center justify-center rounded-full text-[#5d4037]/80 hover:text-[#ad1457] hover:bg-[#fce4ec]/30 transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
              <button onClick={onProfileOpen} className="w-12 h-12 flex items-center justify-center rounded-full text-[#5d4037]/80 hover:text-[#ad1457] hover:bg-[#fce4ec]/30 transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </button>
            </div>

            <button
              onClick={onCartOpen}
              className={`relative group bg-[#ad1457] text-white rounded-full flex items-center gap-4 shadow-[0_12px_30px_rgba(173,20,87,0.15)] transition-all active:scale-95 overflow-hidden ${isScrolled ? 'px-6 py-3' : 'px-9 py-4'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <div className="relative">
                <svg className="w-5 h-5 transition-transform group-hover:rotate-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                {totalItems > 0 && <span className="absolute -top-4 -right-4 bg-white text-[#ad1457] text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#ad1457] animate-bounce">{totalItems}</span>}
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest hidden sm:inline relative">Kosár</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}