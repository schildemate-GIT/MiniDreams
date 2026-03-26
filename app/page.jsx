'use client';


import { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import Link from 'next/link';

// ─── KOSÁR HOOK ────────────────────────────────────────────────────────────────
function useCart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('minidreams_cart');
      if (saved) setCart(JSON.parse(saved));
    } catch {}
  }, []);

  const saveCart = useCallback((newCart) => {
    setCart(newCart);
    localStorage.setItem('minidreams_cart', JSON.stringify(newCart));
  }, []);

  const addToCart = useCallback((name, price, image = '') => {
    setCart(prev => {
      const existing = prev.find(i => i.name === name);
      const updated = existing
        ? prev.map(i => i.name === name ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { name, price, image, quantity: 1 }];
      localStorage.setItem('minidreams_cart', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeFromCart = useCallback((index) => {
    setCart(prev => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem('minidreams_cart', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  return { cart, addToCart, removeFromCart, totalItems, totalPrice };
}

// ─── SCROLL REVEAL HOOK ────────────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); }),
      { threshold: 0.1 }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ─── TOAST HOOK ───────────────────────────────────────────────────────────────
function useToast() {
  const [visible, setVisible] = useState(false);
  const show = useCallback(() => {
    setVisible(true);
    setTimeout(() => setVisible(false), 2200);
  }, []);
  return { visible, show };
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────



// ─── CART DRAWER ──────────────────────────────────────────────────────────────
function CartDrawer({ open, onClose, cart, removeFromCart, totalPrice }) {
  const goToCheckout = () => {
    if (cart.length === 0) { alert('A kosarad üres!'); return; }
    window.location.href = '/checkout';
  };

  return (
    <>
      <div onClick={onClose} className={`fixed inset-0 bg-[#5d4037]/20 backdrop-blur-md z-[51] transition-all duration-500 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} />
      <div className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-white z-[52] flex flex-col shadow-[-20px_0_60px_rgba(0,0,0,0.05)] transition-transform duration-500 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 flex justify-between items-center border-b border-[#fce4ec]/50">
          <div>
            <h2 className="text-2xl font-black text-[#5d4037]">Kosarad</h2>
            <p className="text-xs font-bold text-[#ad1457] uppercase tracking-widest mt-1">Válogatott kincsek</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#fffafb] transition-colors text-2xl">&times;</button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
              <span className="text-5xl">🛍️</span>
              <p className="font-bold italic text-[#8d6e63]">Még nem választottál semmit...</p>
            </div>
          ) : cart.map((item, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-[#fffafb] rounded-xl border border-[#fce4ec]">
              {item.image && <img src={item.image} alt={item.name} className="w-14 h-14 object-contain rounded-lg bg-white border border-[#fce4ec]/50" />}
              <div className="flex-1">
                <p className="font-bold text-sm leading-tight text-[#5d4037]">{item.name}</p>
                <p className="text-xs text-[#ad1457]">{item.price.toLocaleString('hu-HU')} Ft × {item.quantity}</p>
              </div>
              <button onClick={() => removeFromCart(index)} className="text-gray-400 hover:text-red-400 p-1 transition-colors text-xl">&times;</button>
            </div>
          ))}
        </div>
        <div className="p-8 bg-[#fffafb] border-t border-[#fce4ec]/50">
          <div className="flex justify-between items-end mb-8">
            <span className="text-sm font-bold text-[#8d6e63] uppercase tracking-widest">Végösszeg</span>
            <span className="text-3xl font-black text-[#ad1457]">{totalPrice.toLocaleString('hu-HU')} Ft</span>
          </div>
          <button onClick={goToCheckout} className="w-full pink-gradient-btn text-white py-5 rounded-[25px] font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-pink-200">
            Fizetés indítása
          </button>
        </div>
      </div>
    </>
  );
}

// ─── PROFILE DRAWER ───────────────────────────────────────────────────────────
function ProfileDrawer({ open, onClose }) {
  return (
    <div className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-white z-[52] flex flex-col shadow-[-20px_0_60px_rgba(0,0,0,0.05)] transition-transform duration-500 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-8 flex justify-between items-center border-b border-[#fce4ec]/50">
        <h2 className="text-2xl font-black text-[#5d4037]">Profil</h2>
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#fffafb] transition-colors text-2xl">&times;</button>
      </div>
      <div className="p-8 flex-1">
        <div className="bg-[#fffafb] rounded-[35px] p-8 border border-[#fce4ec]/50">
          <div className="w-20 h-20 bg-white rounded-[25px] mb-6 flex items-center justify-center text-3xl shadow-sm border border-[#fce4ec]/30">👋</div>
          <h3 className="text-xl font-black text-[#5d4037] mb-2">Szia! Örülünk, hogy itt vagy.</h3>
          <p className="text-sm text-[#8d6e63] font-medium leading-relaxed mb-8">Jelentkezz be, hogy láthasd korábbi rendeléseidet és elmentett kedvenceidet.</p>
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#ad1457] uppercase tracking-widest ml-2">Email cím</label>
              <input type="email" className="w-full p-4 bg-white border border-[#fce4ec] rounded-2xl outline-none focus:ring-2 focus:ring-[#f48fb1]/20 transition-all text-sm font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#ad1457] uppercase tracking-widest ml-2">Jelszó</label>
              <input type="password" className="w-full p-4 bg-white border border-[#fce4ec] rounded-2xl outline-none focus:ring-2 focus:ring-[#f48fb1]/20 transition-all text-sm font-medium" />
            </div>
            <button className="w-full bg-[#5d4037] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#4a332c] transition-colors shadow-lg">
              Bejelentkezés
            </button>
          </div>
          <div className="mt-8 pt-8 border-t border-[#fce4ec]/50 text-center">
            <p className="text-xs font-bold text-[#8d6e63]">Még nincs fiókod? <a href="#" className="text-[#f48fb1] hover:underline">Regisztrálj most!</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ visible }) {
  return (
    <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] glass text-[#ad1457] border-[#fce4ec] px-8 py-4 rounded-[20px] shadow-2xl transition-all duration-500 text-sm font-bold flex items-center gap-3 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <span className="text-xl">✨</span> Termék a kosárhoz adva!
    </div>
  );
}

// ─── HERO SECTION ─────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#f8bbd0] rounded-full blur-[120px] opacity-40 animate-pulse-soft" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#c8e6c9] rounded-full blur-[120px] opacity-40 animate-pulse-soft" />
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative">
        <div className="reveal active">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-12 h-[2px] bg-[#ec407a]" />
            <span className="text-[#ec407a] font-bold tracking-widest text-xs uppercase">Tavaszi újdonságok</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-[#5d4037] leading-[0.9] mb-8">
            Friss tavasz, <br /><span className="text-[#ec407a]">puha</span> pillanatok.
          </h1>
          <p className="text-lg text-[#8d6e63] mb-10 max-w-sm">
            Könnyed, légies babaruhák és kiegészítők a napsütéses napokra – tökéletes választás a felfedezéshez és a játékhoz.
          </p>
          <div className="flex gap-4">
            <button onClick={() => window.location.href = '/catalog'} className="pink-gradient-btn text-white px-10 py-5 rounded-2xl font-bold uppercase text-xs tracking-widest">
              Vásárlás
            </button>
            <button className="glass px-10 py-5 rounded-2xl font-bold uppercase text-xs tracking-widest border border-[#fce4ec]">
              Katalógus
            </button>
          </div>
        </div>
        <div className="relative hidden lg:block">
          <div className="relative z-10 w-full h-[600px] bg-[#f1f8e9] rounded-[100px_40px_100px_40px] overflow-hidden float-anim shadow-2xl border-[16px] border-white">
            <img src="https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover" alt="Tavaszi baba napsütésben" />
          </div>
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white rounded-3xl shadow-xl p-3 z-20 rotate-6">
            <img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover rounded-2xl" alt="Tavaszi hangulat" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── BRANDS SECTION ───────────────────────────────────────────────────────────
function BrandsSection() {
  const brands = [
    { icon: '🧸', name: 'Little Dutch', bg: '#e3f2fd', hbg: '#bbdefb' },
    { icon: '🧩', name: 'Muffik', bg: '#f3e5f5', hbg: '#e1bee7' },
  ];
  return (
    <section className="py-12 bg-white/50 border-y border-[#fce4ec]/30">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-[10px] uppercase tracking-[0.3em] font-bold text-[#ad1457]/60 mb-10">Kiemelt partnereink & Márkáink</p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-80">
          {brands.map(b => (
            <div key={b.name} className="group flex flex-col items-center transition-all duration-300 hover:scale-110">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-sm transition-colors" style={{ background: b.bg }}>
                <span className="text-2xl group-hover:scale-110 transition-all">{b.icon}</span>
              </div>
              <span className="text-xs font-bold text-[#8d6e63] tracking-widest uppercase">{b.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── GENDER SECTION ───────────────────────────────────────────────────────────
function GenderSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-[#5d4037] mb-4">Keresd a tökéletes ajándékot</h2>
          <p className="text-[#8d6e63] italic">Válogass kifejezetten kisfiúknak vagy kislányoknak összeállított kollekciónkból</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative group overflow-hidden rounded-[50px] cursor-pointer shadow-xl shadow-blue-100/50">
            <div className="absolute inset-0 bg-[#e3f2fd] opacity-80 group-hover:bg-[#bbdefb] transition-colors duration-500" />
            <div className="relative p-12 flex flex-col items-start h-[400px] justify-center">
              <span className="bg-white/90 text-[#1976d2] px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">Little Prince</span>
              <h3 className="text-4xl font-black text-[#0d47a1] mb-6">Kisfiús <br />Anyukáknak</h3>
              <p className="text-[#1565c0] mb-8 max-w-[250px]">Kék tónusok, kalandos minták és strapabíró játékok a kis felfedezőknek.</p>
              <a href="/catalog?type=boys" className="bg-white text-[#1976d2] px-8 py-3 rounded-2xl font-bold hover:shadow-lg hover:-translate-y-1 transition-all">Irány a fiús rész →</a>
              <div className="absolute -bottom-10 -right-10 text-9xl opacity-10 group-hover:rotate-12 transition-transform duration-700">✈️</div>
            </div>
          </div>
          <div className="relative group overflow-hidden rounded-[50px] cursor-pointer shadow-xl shadow-pink-100/50">
            <div className="absolute inset-0 bg-[#fce4ec] opacity-80 group-hover:bg-[#f8bbd0] transition-colors duration-500" />
            <div className="relative p-12 flex flex-col items-start h-[400px] justify-center">
              <span className="bg-white/90 text-[#ad1457] px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">Little Princess</span>
              <h3 className="text-4xl font-black text-[#880e4f] mb-6">Lányos <br />Anyukáknak</h3>
              <p className="text-[#ad1457] mb-8 max-w-[250px]">Púder színek, tüllök és tündéri kiegészítők az apró hercegnőknek.</p>
              <a href="/catalog?type=girls" className="bg-white text-[#ad1457] px-8 py-3 rounded-2xl font-bold hover:shadow-lg hover:-translate-y-1 transition-all">Irány a lányos rész →</a>
              <div className="absolute -bottom-10 -right-10 text-9xl opacity-10 group-hover:-rotate-12 transition-transform duration-700">👑</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CATEGORIES SECTION ───────────────────────────────────────────────────────
const CATEGORIES = [
  { img: '/images/LD.png', title: 'Little Dutch', sub: 'Minőségi fa játékok és textilek' },
  { img: '/images/Mufi.png', title: 'Muffik', sub: 'Ortopédiai szenzoros szőnyegek' },
  { img: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop', title: 'Újdonságok', sub: 'Legfrissebb kincseink' },
  { img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop', title: 'Akciós', sub: 'Szuper termékek kedvező áron' },
  { img: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=800&auto=format&fit=crop', title: 'Szezonális', sub: 'Épp időben, az évszakhoz' },
  { img: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop', title: 'Étkezés és Ápolás', sub: 'Szilikon készletek, előkék' },
];

function CategoriesSection() {
  return (
    <section className="py-20 bg-[#fffafc]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#ec407a]/60 mb-4">Válogass könnyedén</p>
          <h2 className="text-4xl md:text-5xl font-black text-[#5d4037]">Kiemelt kategóriák</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CATEGORIES.map((cat) => (
            <div key={cat.title} className="group relative rounded-[40px] overflow-hidden shadow-lg cursor-pointer reveal">
              <img src={cat.img} className="w-full h-[400px] object-cover group-hover:scale-110 transition duration-500" alt={cat.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold mb-1">{cat.title}</h3>
                <p className="text-sm opacity-80">{cat.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
function ProductCard({ product, onAddToCart }) {
  const image = product.images.edges[0]?.node.url || '';
  const price = Math.round(parseFloat(product.variants.edges[0]?.node.price?.amount || 0));
  const handle = product.handle; // Fontos: a Shopify handle az URL alapja

  return (
    <div className="group flex flex-col h-full max-w-[350px] mx-auto transition-all duration-500 hover:-translate-y-2">
      {/* A kártya fő része mostantól egy Link */}
      <div className="relative overflow-hidden rounded-[35px] bg-white border border-[#fce4ec]/30 p-5 shadow-sm hover:shadow-[0_20px_50px_rgba(236,64,122,0.15)] transition-all duration-500 flex flex-col h-full">
        
        {/* KATTINTHATÓ TERÜLET: Kép és Cím */}
        <Link href={`/product/${handle}`} className="cursor-pointer">
          <div className="relative w-full h-[280px] overflow-hidden rounded-[28px] mb-5 bg-[#fffafb] flex items-center justify-center shrink-0">
            {image ? (
              <img
                src={image}
                alt={product.title}
                className="w-full h-full object-contain p-4 transition duration-700 ease-in-out group-hover:scale-110"
              />
            ) : (
              <span className="text-4xl opacity-20">🧸</span>
            )}

            <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
              <span className="text-[10px] font-bold text-[#ad1457] uppercase tracking-wider">Kiemelt</span>
            </div>
          </div>

          <h3 className="text-lg font-black mb-1 leading-tight text-[#5d4037] group-hover:text-[#ad1457] transition-colors uppercase tracking-tight italic line-clamp-2 min-h-[3rem]">
            {product.title}
          </h3>
        </Link>

        {/* NEM KATTINTHATÓ (vagy külön kezelt) RÉSZ: Ár és gomb */}
        <div className="flex flex-col flex-grow">
          <p className="text-[#8d6e63]/60 text-[11px] font-bold uppercase tracking-widest mb-4">Gondos választás</p>
          
          <div className="mt-auto pt-4 flex justify-between items-center border-t border-[#fce4ec]/30">
            <div className="flex flex-col">
              <span className="text-[10px] text-[#ad1457]/50 font-bold uppercase -mb-1">Ár</span>
              <span className="text-2xl font-black text-[#ad1457] italic">
                {price.toLocaleString('hu-HU')} <small className="text-sm">Ft</small>
              </span>
            </div>
            
            <button
              onClick={() => onAddToCart(product.title, price, image)}
              className="relative overflow-hidden group/btn bg-[#fce4ec] text-[#ad1457] w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 active:scale-90 shadow-sm"
            >
              <span className="relative z-10 text-2xl font-bold group-hover/btn:opacity-0 transition-opacity">+</span>
              <div className="absolute inset-0 bg-[#ad1457] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
              <span className="absolute z-10 text-white opacity-0 group-hover/btn:opacity-100 transition-opacity text-2xl font-bold">+</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── FEATURED PRODUCTS ────────────────────────────────────────────────────────
function FeaturedProducts({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
  `https://mateshoes.myshopify.com/api/2024-01/graphql.json`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': '8bae15f33460e918e1b6924ad84a40ea'
    },
    body: JSON.stringify({
      query: `
        {
          products(first: 3) {
            edges {
              node {
                id
                title
                handle
                images(first:1){ edges{ node{ url(transform: { maxWidth: 600, maxHeight: 600 }) } } }
                variants(first:1){ edges{ node{ price{ amount } } } }
              }
            }
          }
        }
      `
    })
  }
);
        if (!res.ok) throw new Error(`Szerver hiba: ${res.status}`);
        const data = await res.json();
        const edges = data?.data?.products?.edges;
        if (!edges || edges.length === 0) throw new Error('Nincs termék');
        setProducts(edges.map(e => e.node));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <section id="top-termekek" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#ec407a]/60 mb-3">Amiért a szülők rajonganak</p>
            <h2 className="text-4xl md:text-5xl font-black text-[#5d4037]">Top termékeink</h2>
          </div>
          <a href="/termekek" className="text-[#ec407a] font-bold text-sm border-b-2 border-[#ec407a]/20 hover:border-[#ec407a] transition-all pb-1">Összes termék megtekintése →</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
 {loading && [1,2,3].map(i => (
  <div key={i} className="bg-gray-50 min-h-[450px] rounded-[40px] animate-pulse" />
))}
          {error && <p className="col-span-3 text-center text-[#8d6e63] italic">Hiba történt a betöltéskor.</p>}
          {products.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />)}
        </div>
      </div>
    </section>
  );
}

// ─── ABOUT SECTION ────────────────────────────────────────────────────────────
function AboutSection() {
  return (
    <section id="rolunk" className="py-24 bg-gradient-to-b from-white to-[#fdf2f5] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative reveal">
            <div className="relative z-10 rounded-[60px] overflow-hidden shadow-2xl border-[12px] border-white transform rotate-2 hover:rotate-0 transition-transform duration-700">
              <img src="/aboutus.png" alt="Családi pillanat" className="w-full h-full object-cover aspect-[4/5]" />
            </div>
            <div className="absolute bottom-12 -right-6 bg-white/90 backdrop-blur-md p-6 rounded-[30px] shadow-xl z-20 flex items-center gap-4 animate-bounce">
              <div className="bg-[#fce4ec] w-12 h-12 rounded-2xl flex items-center justify-center text-2xl">💝</div>
              <div>
                <p className="font-black text-[#ad1457] text-xl">12k+</p>
                <p className="text-[10px] text-[#8d6e63] uppercase font-bold tracking-tighter">Boldog baba</p>
              </div>
            </div>
          </div>
          <div className="reveal">
            <span className="inline-block px-4 py-1.5 bg-[#fce4ec] text-[#ad1457] rounded-full text-[10px] font-black uppercase tracking-widest mb-6">A mi történetünk</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#5d4037] mb-8 leading-tight">
              Szeretettel tervezve a <br /><span className="text-[#f48fb1]">legkisebb álmokhoz.</span>
            </h2>
            <p className="text-[#8d6e63] leading-relaxed mb-8 text-lg">
              A MiniDreams egy apró családi vállalkozásként indult a nappalinkból, azzal a vággyal, hogy olyan babaruhákat és kiegészítőket alkossunk, amelyek nemcsak gyönyörűek, de biztonságosak is.
            </p>
            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              <div className="group p-5 bg-white rounded-3xl border border-[#fce4ec] hover:bg-[#fce4ec]/30 transition-colors">
                <span className="text-3xl block mb-3">🌿</span>
                <h4 className="font-bold text-[#5d4037]">Tiszta forrás</h4>
                <p className="text-xs text-[#8d6e63]">Csak 100% organikus és bababarát anyagokkal dolgozunk.</p>
              </div>
              <div className="group p-5 bg-white rounded-3xl border border-[#f3e5f5] hover:bg-[#f3e5f5]/30 transition-colors">
                <span className="text-3xl block mb-3">🎨</span>
                <h4 className="font-bold text-[#5d4037]">Egyedi design</h4>
                <p className="text-xs text-[#8d6e63]">Saját tervezésű pasztell árnyalatok és minták.</p>
              </div>
            </div>
            <button className="flex items-center gap-3 text-[#f48fb1] font-bold hover:gap-5 transition-all group">
              Tudj meg többet rólunk
              <span className="w-10 h-10 rounded-full bg-[#fce4ec] flex items-center justify-center group-hover:bg-[#f48fb1] group-hover:text-white transition-all">&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
function TestimonialsSection() {
  const reviews = [
    { text: 'A legpuhább anyagok, amikkel valaha találkoztam. A kisfiam imádja a plüss macit, mindenhova magával viszi!', name: 'Kovács Anna', color: '#ce93d8' },
    { text: 'Gyors szállítás, gyönyörű csomagolás és tökéletes minőség. Biztosan visszatérek vásárolni!', name: 'Nagy Eszter', color: '#f48fb1' },
    { text: 'Végre egy bolt, ahol minden bababarát és organikus. A kislányom imádja a rugdalózókat!', name: 'Tóth Réka', color: '#80cbc4' },
  ];
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-black text-[#5d4037] mb-12">Amit az anyukák mondanak 💖</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <div key={i} className="p-8 rounded-[40px] bg-[#fffafb] border border-[#fce4ec] relative reveal">
              <div className="text-[#f48fb1] text-4xl absolute -top-4 left-8">"</div>
              <p className="text-[#8d6e63] italic mb-6">"{r.text}"</p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full" style={{ background: r.color }} />
                <div className="text-left">
                  <p className="font-bold text-sm text-[#5d4037]">{r.name}</p>
                  <p className="text-[10px] text-[#ad1457] uppercase font-bold">Hiteles vásárló</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── TRUST BADGES ─────────────────────────────────────────────────────────────
function TrustSection() {
  const badges = [
    { icon: '🚚', title: 'Gyors szállítás', sub: '2-3 munkanapon belül' },
    { icon: '🌿', title: 'Bio anyagok', sub: 'OEKO-TEX minősítés' },
    { icon: '💳', title: 'Biztonságos fizetés', sub: 'Bankkártya vagy utánvét' },
    { icon: '🔄', title: '30 napos csere', sub: 'Kérdés nélküli garancia' },
  ];
  return (
    <section className="py-16 border-y border-[#fce4ec]/50 bg-[#fffcfd]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {badges.map(b => (
            <div key={b.title} className="text-center">
              <div className="text-3xl mb-3">{b.icon}</div>
              <h4 className="font-bold text-[#5d4037] text-sm">{b.title}</h4>
              <p className="text-[11px] text-[#8d6e63]">{b.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="relative bg-[#5d4037] text-white pt-32 pb-12 rounded-[60px_60px_0_0] overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#f48fb1]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ce93d8]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="space-y-8">
            <div>
              <div className="text-3xl font-black tracking-tighter text-[#f48fb1] mb-4">Mini<span className="text-[#ce93d8]">Dreams</span></div>
              <p className="text-gray-300 leading-relaxed font-medium">Prémium minőség, anyai gondoskodással válogatva. Segítünk, hogy a babavárás és a gyermekkor minden pillanata varázslatos legyen.</p>
            </div>
            <div className="flex gap-4">
              {['instagram','facebook'].map(s => (
                <a key={s} href="#" className="group w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-[#ad1457] transition-all duration-500 hover:-translate-y-2 shadow-lg">
                  {s === 'instagram'
                    ? <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    : <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                  }
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-lg font-black mb-8 text-[#fce4ec] tracking-tight">Vásárlás</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              {['Szállítási infók','Fizetési módok','Garancia & Csere','ÁSZF'].map(item => (
                <li key={item}><a href="#" className="hover:text-[#f48fb1] transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-[#f48fb1] rounded-full opacity-0 group-hover:opacity-100 transition-all" /> {item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-black mb-8 text-[#fce4ec] tracking-tight">Segítség</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              {['Kapcsolat','Gyakori kérdések','Mérettáblázatok','Blog'].map(item => (
                <li key={item}><a href="#" className="hover:text-[#f48fb1] transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-[#f48fb1] rounded-full opacity-0 group-hover:opacity-100 transition-all" /> {item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-black mb-8 text-[#fce4ec] tracking-tight">Hírlevél</h4>
            <p className="text-sm text-gray-400 mb-6 font-medium">Iratkozz fel és kapsz egy <span className="text-[#f48fb1] font-bold">10%-os kupont</span> az első vásárlásodhoz!</p>
            <div className="relative group/input">
              <input type="email" placeholder="Email címed..." className="w-full bg-white/5 border border-white/10 p-4 pr-12 rounded-2xl outline-none focus:border-[#f48fb1] focus:bg-white/10 transition-all text-sm placeholder:text-gray-500" />
              <button className="absolute right-2 top-2 bottom-2 bg-[#f48fb1] hover:bg-[#ad1457] text-white px-4 rounded-xl transition-all duration-300 active:scale-95">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </button>
            </div>
            <p className="text-[10px] text-gray-500 mt-4 italic text-center">Megígérjük, nem küldünk spameket! ✨</p>
          </div>
        </div>
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">&copy; 2026 MiniDreams. Minden jog fenntartva.</p>
          <div className="flex gap-3 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
            <span className="text-xl">💳</span><span className="text-xl">🍎</span><span className="text-xl">🅿️</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { cart, addToCart, removeFromCart, totalItems, totalPrice } = useCart();
  const { visible: toastVisible, show: showToast } = useToast();
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useScrollReveal();

  const handleAddToCart = useCallback((name, price, image) => {
    addToCart(name, price, image);
    showToast();
  }, [addToCart, showToast]);

  return (
    <>
      <style>{`
        body { font-family: 'Quicksand', sans-serif; overflow-x: hidden; scroll-behavior: smooth; background: #fffcfd; color: #5d4037; }
        .glass { backdrop-filter: blur(12px); background: rgba(255,255,255,0.7); border: 1px solid rgba(252,228,236,0.5); }
        .pink-gradient-btn { background: linear-gradient(90deg, #f48fb1, #f06292); transition: all 0.3s ease; }
        .pink-gradient-btn:hover { box-shadow: 0 10px 20px -5px rgba(244,143,177,0.5); transform: translateY(-2px); }
        .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s cubic-bezier(0.4,0,0.2,1); }
        .reveal.active { opacity: 1; transform: translateY(0); }
        .float-anim { animation: float 4s ease-in-out infinite; }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        @keyframes pulse-soft { 0%,100% { opacity: 0.6; } 50% { opacity: 0.8; } }
        .animate-pulse-soft { animation: pulse-soft 3s infinite; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #fffafb; }
        ::-webkit-scrollbar-thumb { background: #fce4ec; border-radius: 10px; }
      `}</style>

      <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <Toast visible={toastVisible} />

   <Header 
        totalItems={totalItems} 
        onCartOpen={() => setCartOpen(true)} 
        onProfileOpen={() => setProfileOpen(true)} 
      />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} removeFromCart={removeFromCart} totalPrice={totalPrice} />

      {profileOpen && (
        <div onClick={() => setProfileOpen(false)} className="fixed inset-0 bg-[#5d4037]/20 backdrop-blur-md z-[51]" />
      )}
      <ProfileDrawer open={profileOpen} onClose={() => setProfileOpen(false)} />

      <main>
        <HeroSection />
        <BrandsSection />
        <GenderSection />
        <CategoriesSection />
        <FeaturedProducts onAddToCart={handleAddToCart} />
        <AboutSection />
        <TestimonialsSection />
        <TrustSection />
      </main>

      <Footer />
    </>
  );
}
