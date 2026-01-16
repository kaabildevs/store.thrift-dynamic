import React, { useState, useEffect, useRef } from 'react';
// Assuming these imports exist based on your project structure
import { Navbar, Footer } from './components/Layout';
import { Product, ViewState, CartItem } from './types';
import { PRODUCTS } from './constants';
import { getStylingAdvice } from './services/geminiService';

// Ensure GSAP is available globally
declare const gsap: any;
declare const ScrollTrigger: any;

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [stylingAdvice, setStylingAdvice] = useState<string>('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  // Refs for Animation (Fixes the conflict between GSAP and Tailwind)
  const containerRef = useRef<HTMLDivElement>(null);
  const addToCartBtnRef = useRef<HTMLButtonElement>(null);
  const cartIconRef = useRef<HTMLDivElement>(null);
  const btnTextRef = useRef<HTMLSpanElement>(null);

  // Initialize ScrollTrigger
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  // Navigation Handler with Transition
  const handleNavigate = (view: ViewState, product?: Product) => {
    // Fade out current content
    gsap.to(containerRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        // Change State
        if (product) {
          setSelectedProduct(product);
          // Reset advice when entering a new product
          setStylingAdvice(''); 
        }
        setCurrentView(view);
        
        // Scroll to top
        window.scrollTo(0, 0);

        // Fade in new content
        gsap.fromTo(containerRef.current, 
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.1 }
        );
      }
    });
  };

  // --- FIXED ADD TO CART ANIMATION ---
  const addToCart = (product: Product, size: string) => {
    // 1. Update State
    const newItem: CartItem = { ...product, size, quantity: 1 };
    setCart([...cart, newItem]);
    
    // 2. Animation Logic (GSAP handles 100% of movement)
    const btn = addToCartBtnRef.current;
    const icon = cartIconRef.current;
    const text = btnTextRef.current;

    if (btn && icon && text) {
      const btnWidth = btn.offsetWidth;

      // Kill any active animations to prevent conflicts/glitches
      gsap.killTweensOf([btn, icon, text]);

      const tl = gsap.timeline();
      
      // STEP A: RESET POSITIONS
      // Force icon to start completely off-screen to the left
      gsap.set(icon, { x: -100, opacity: 1, scale: 1 });
      gsap.set(btn, { clearProps: "all" }); // Reset button styles

      // STEP B: ANIMATION SEQUENCE
      
      // 1. The Whoosh: Icon flies from left (-100) to right (width + 100)
      tl.to(icon, {
        x: btnWidth + 100, 
        duration: 0.6,
        ease: "power4.inOut", // Fast "speedy" ease
      }, 0);

      // 2. Button Impact: Squish slightly
      tl.to(btn, { 
        scale: 0.95, 
        duration: 0.1, 
        yoyo: true, 
        repeat: 1 
      }, 0);

      // 3. Color Flash: Turn White
      tl.to(btn, { 
        backgroundColor: "#ffffff",
        color: "#121212",
        duration: 0.1 
      }, 0);

      // 4. Text Swap: Change "Add to Cart" to "ADDED"
      setTimeout(() => {
        if(text) text.innerText = "ADDED";
      }, 200);

      // STEP C: REVERT (After 1.5 seconds)
      tl.to(btn, { 
        backgroundColor: "#ff5e00", // Revert to Accent Orange
        color: "#121212", // Revert to Charcoal Text
        duration: 0.3,
        delay: 1.5,
        onStart: () => {
          if(text) text.innerText = "ADD TO CART";
        },
        onComplete: () => {
          // Clean up to allow CSS hover states to work again
          gsap.set(btn, { clearProps: "all" });
          // Hide icon again
          gsap.set(icon, { opacity: 0 });
        }
      });
    }
  };

  const fetchStylingAdvice = async (product: Product) => {
    setLoadingAdvice(true);
    const advice = await getStylingAdvice(product);
    setStylingAdvice(advice);
    setLoadingAdvice(false);
  };

  // --- Views ---

  const HomeView = () => (
    <div id="home" className="w-full">
      {/* Hero */}
      <section className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden border-b border-slate">
        <div className="absolute inset-0 z-0 opacity-40">
           <img 
            src="https://picsum.photos/id/449/1920/1080" 
            alt="Hero Background" 
            className="w-full h-full object-cover grayscale"
           />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-6 text-lightgray">
            {/* BRANDING UPDATE: Black text on Orange Background for 'DEFINED' */}
            ARCHIVE <br/> RE<span className="bg-accent text-charcoal px-2 md:px-4">DEFINED</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-light">
            Curated vintage for the post-modern minimalist.
          </p>
          <button 
            onClick={() => handleNavigate('shop')}
            className="bg-accent text-charcoal px-10 py-4 text-lg font-bold uppercase tracking-widest hover:bg-white transition-colors duration-300"
          >
            Shop Now
          </button>
        </div>
      </section>

      {/* Featured Arrivals */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex justify-between items-end mb-12 border-b border-slate pb-6">
          <h2 className="text-4xl font-bold tracking-tight">LATEST DROPS</h2>
          <button onClick={() => handleNavigate('shop')} className="text-accent hover:text-white uppercase text-sm font-bold tracking-wider">View All</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRODUCTS.slice(0, 3).map((product, index) => (
            <div 
              key={product.id} 
              className="group cursor-pointer"
              onClick={() => handleNavigate('product-view', product)}
              onMouseEnter={(e) => gsap.to(e.currentTarget, { y: -10, duration: 0.3 })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { y: 0, duration: 0.3 })}
            >
              <div className="bg-slate aspect-[3/4] overflow-hidden mb-6 relative">
                 <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-in-out"
                 />
                 <div className="absolute top-4 right-4 bg-charcoal/80 text-white text-xs px-2 py-1 uppercase tracking-widest backdrop-blur-sm">
                   New
                 </div>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">{product.name}</h3>
              <p className="text-gray-500">${product.price}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const ShopView = () => {
    useEffect(() => {
      // Stagger animation for product cards
      const ctx = gsap.context(() => {
        gsap.fromTo('.product-card-anim',
          { y: 60, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.8, 
            stagger: 0.1, 
            ease: 'power3.out',
            delay: 0.1 
          }
        );
      });
      return () => ctx.revert();
    }, []);

    return (
      <div id="shop" className="max-w-7xl mx-auto px-6 py-12 pt-32">
          <div className="mb-12">
             <h1 className="text-5xl font-black tracking-tighter mb-4">THE COLLECTION</h1>
             
             {/* Simulated Filters */}
             <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-400 border-y border-slate py-4">
                <span className="text-white border-b-2 border-accent pb-0.5 cursor-pointer">VIEW ALL</span>
                <span className="hover:text-white cursor-pointer transition-colors">OUTERWEAR</span>
                <span className="hover:text-white cursor-pointer transition-colors">TOPS</span>
                <span className="hover:text-white cursor-pointer transition-colors">BOTTOMS</span>
                <span className="hover:text-white cursor-pointer transition-colors">ACCESSORIES</span>
             </div>
          </div>
 
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
             {PRODUCTS.map((product) => (
               <div 
                 key={product.id} 
                 className="group cursor-pointer product-card-anim opacity-0"
                 onClick={() => handleNavigate('product-view', product)}
               >
                 <div className="bg-slate aspect-[3/4] overflow-hidden mb-4 relative">
                    <img 
                     src={product.images[0]} 
                     alt={product.name} 
                     className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                 </div>
                 <div className="flex justify-between items-start">
                   <div>
                      <h3 className="text-sm font-bold tracking-wide group-hover:text-accent transition-colors uppercase">{product.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{product.category}</p>
                   </div>
                   <span className="text-sm font-medium text-gray-300">${product.price}</span>
                 </div>
               </div>
             ))}
          </div>
      </div>
    );
  };

  const ProductView = () => {
    if (!selectedProduct) return null;
    const [activeTab, setActiveTab] = useState('desc');
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    // GSAP Pulse Animation for Size Selection
    useEffect(() => {
      if (selectedSize) {
        gsap.fromTo(`.size-btn-${selectedSize}`, 
          { scale: 1 }, 
          { scale: 1.15, duration: 0.15, yoyo: true, repeat: 1, ease: "back.out(1.7)" }
        );
      }
    }, [selectedSize]);

    return (
      <div id="product-view" className="pt-20 min-h-screen flex flex-col">
          <div className="flex flex-col lg:flex-row h-full flex-grow">
            {/* Left: Gallery */}
            <div className="w-full lg:w-3/5 bg-slate h-[50vh] lg:h-auto overflow-y-scroll no-scrollbar relative">
               <div className="grid grid-cols-1 gap-2 p-2">
                 {selectedProduct.images.map((img, idx) => (
                   <img key={idx} src={img} className="w-full object-cover" alt={`${selectedProduct.name} ${idx}`} />
                 ))}
               </div>
            </div>

            {/* Right: Details */}
            <div className="w-full lg:w-2/5 p-8 lg:p-16 flex flex-col justify-start overflow-y-auto">
               <div className="text-xs text-gray-500 mb-6 uppercase tracking-widest">
                  <span onClick={() => handleNavigate('home')} className="cursor-pointer hover:text-white">Home</span> 
                  <span className="mx-2">/</span>
                  <span onClick={() => handleNavigate('shop')} className="cursor-pointer hover:text-white">Shop</span> 
                  <span className="mx-2">/</span>
                  <span className="text-white">{selectedProduct.name}</span>
               </div>

               <h1 className="text-4xl lg:text-5xl font-black tracking-tighter mb-4 leading-tight">
                 {selectedProduct.name}
               </h1>

               <div className="flex items-center space-x-4 mb-6">
                 <span className="text-2xl font-light text-accent">${selectedProduct.price}</span>
                 <div className="text-sm text-gray-400">
                   ★★★★☆ <span className="text-gray-600">({selectedProduct.rating}/5 from {selectedProduct.reviewsCount} reviews)</span>
                 </div>
               </div>

               <p className="text-gray-400 leading-relaxed mb-8">
                 {selectedProduct.shortDescription}
               </p>

               {/* Stylist AI */}
               <div className="mb-8 p-4 bg-slate/30 border border-slate/50 rounded-sm">
                  <div className="flex justify-between items-center mb-2">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-accent">AI Stylist</h4>
                      {!stylingAdvice && (
                        <button 
                          onClick={() => fetchStylingAdvice(selectedProduct)}
                          disabled={loadingAdvice}
                          className="text-[10px] uppercase bg-charcoal px-2 py-1 border border-gray-700 hover:border-white transition-colors"
                        >
                          {loadingAdvice ? 'Thinking...' : 'Get Advice'}
                        </button>
                      )}
                  </div>
                  <p className="text-sm text-gray-300 italic">
                    {stylingAdvice || "Not sure how to rock this? Ask our AI Stylist for a curated look."}
                  </p>
               </div>

               {/* Size Selector */}
               <div className="mb-8">
                 <h4 className="text-xs font-bold uppercase mb-3 text-gray-500">Select Size</h4>
                 <div className="flex space-x-3">
                   {['S', 'M', 'L', 'XL'].map(size => (
                     <button 
                       key={size}
                       onClick={() => setSelectedSize(size)}
                       className={`size-btn-${size} w-12 h-12 flex items-center justify-center border font-bold transition-all ${selectedSize === size ? 'bg-white text-charcoal border-white' : 'border-gray-700 text-gray-400 hover:border-gray-400'}`}
                     >
                       {size}
                     </button>
                   ))}
                 </div>
               </div>

               {/* REPLACED BUTTON WITH REF-BASED ANIMATION */}
               <button 
                 ref={addToCartBtnRef} // Attached Ref
                 onClick={() => selectedSize ? addToCart(selectedProduct, selectedSize) : alert('Please select a size')}
                 className={`w-full py-5 font-black uppercase tracking-widest text-lg mb-10 transition-colors relative overflow-hidden group ${selectedSize ? 'bg-accent text-charcoal hover:bg-white' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
               >
                 <span ref={btnTextRef} className="relative z-10">Add to Cart</span>
                 
                 {/* The Cart Icon Container - Removed 'translate' classes, GSAP handles pos */}
                 <div 
                   ref={cartIconRef} // Attached Ref
                   className="absolute top-1/2 left-0 -translate-y-1/2 text-charcoal z-20 opacity-0 pointer-events-none"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                 </div>
               </button>

               {/* Accordion */}
               <div className="border-t border-slate">
                 {['Description', 'Materials', 'Shipping'].map((tab) => (
                    <div key={tab} className="border-b border-slate">
                       <button 
                         onClick={() => setActiveTab(tab.toLowerCase())}
                         className="w-full py-4 flex justify-between items-center uppercase text-sm font-bold tracking-wider hover:text-accent transition-colors"
                       >
                         {tab}
                         <span>{activeTab === tab.toLowerCase() ? '-' : '+'}</span>
                       </button>
                       {activeTab === tab.toLowerCase() && (
                         <div className="pb-4 text-sm text-gray-400 leading-relaxed animate-fadeIn">
                            {tab === 'Description' && selectedProduct.description}
                            {tab === 'Materials' && selectedProduct.materials}
                            {tab === 'Shipping' && selectedProduct.shipping}
                         </div>
                       )}
                    </div>
                 ))}
               </div>

               {/* Tags */}
               <div className="mt-8 flex flex-wrap gap-2">
                  {selectedProduct.tags.map(tag => (
                    <span key={tag} className="text-xs text-gray-600 bg-slate/50 px-2 py-1 hover:text-accent cursor-pointer transition-colors">
                      {tag}
                    </span>
                  ))}
               </div>
            </div>
          </div>

          {/* Related Items (Simple version for demo) */}
          <div className="max-w-7xl mx-auto px-6 py-16 w-full border-t border-slate">
             <h3 className="text-2xl font-bold mb-8">YOU MIGHT ALSO LIKE</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {PRODUCTS.filter(p => p.id !== selectedProduct.id).slice(0,3).map(p => (
                  <div key={p.id} className="cursor-pointer" onClick={() => handleNavigate('product-view', p)}>
                     <div className="bg-slate aspect-[4/5] overflow-hidden mb-2">
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                     </div>
                     <h4 className="text-sm font-bold">{p.name}</h4>
                     <span className="text-xs text-gray-500">${p.price}</span>
                  </div>
               ))}
             </div>
          </div>
      </div>
    );
  };

  const CheckoutView = () => (
    <div id="checkout" className="max-w-7xl mx-auto px-6 pt-32 pb-24 min-h-screen">
       <h1 className="text-4xl font-black tracking-tighter mb-12">CHECKOUT</h1>
       <div className="flex flex-col lg:flex-row gap-16">
          {/* Left: Form */}
          <div className="w-full lg:w-3/5 space-y-8">
             <section>
                <h3 className="text-lg font-bold border-b border-slate pb-2 mb-6 uppercase text-accent">Shipping Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <input type="text" placeholder="First Name" className="bg-slate border-none p-4 text-white placeholder-gray-500 focus:ring-1 focus:ring-accent" />
                   <input type="text" placeholder="Last Name" className="bg-slate border-none p-4 text-white placeholder-gray-500 focus:ring-1 focus:ring-accent" />
                   <input type="email" placeholder="Email Address" className="bg-slate border-none p-4 text-white placeholder-gray-500 focus:ring-1 focus:ring-accent md:col-span-2" />
                   <input type="text" placeholder="Address" className="bg-slate border-none p-4 text-white placeholder-gray-500 focus:ring-1 focus:ring-accent md:col-span-2" />
                   <input type="text" placeholder="City" className="bg-slate border-none p-4 text-white placeholder-gray-500 focus:ring-1 focus:ring-accent" />
                   <input type="text" placeholder="Postal Code" className="bg-slate border-none p-4 text-white placeholder-gray-500 focus:ring-1 focus:ring-accent" />
                </div>
             </section>
             <section>
                <h3 className="text-lg font-bold border-b border-slate pb-2 mb-6 uppercase text-accent">Payment</h3>
                <div className="bg-slate/50 p-6 flex items-center justify-center border border-dashed border-gray-700 h-32 text-gray-500">
                   Stripe / Credit Card Integration Placeholder
                </div>
             </section>
          </div>

          {/* Right: Summary */}
          <div className="w-full lg:w-2/5">
             <div className="bg-slate p-8 sticky top-32">
                <h3 className="text-lg font-bold mb-6 uppercase">Order Summary</h3>
                <div className="space-y-4 mb-8">
                   {cart.length === 0 ? (
                      <p className="text-gray-500 italic">Your cart is empty.</p>
                   ) : (
                      cart.map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-sm">
                           <div className="flex items-center">
                              <div className="w-10 h-10 bg-gray-800 mr-3 overflow-hidden">
                                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold">{item.name}</span>
                                <span className="text-xs text-gray-400">Size: {item.size}</span>
                              </div>
                           </div>
                           <span>${item.price}</span>
                        </div>
                      ))
                   )}
                </div>
                
                <div className="border-t border-gray-700 pt-4 space-y-2 text-sm">
                   <div className="flex justify-between text-gray-400"><span>Subtotal</span> <span>${cart.reduce((acc, item) => acc + item.price, 0)}</span></div>
                   <div className="flex justify-between text-gray-400"><span>Shipping</span> <span>$0.00</span></div>
                   <div className="flex justify-between font-bold text-lg mt-4 text-white"><span>Total</span> <span>${cart.reduce((acc, item) => acc + item.price, 0)}</span></div>
                </div>

                <button className="w-full bg-accent text-charcoal py-4 mt-8 font-black uppercase tracking-widest hover:bg-white transition-colors">
                   Pay Now
                </button>
                <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-gray-500">
                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                   <span>Secure SSL Encrypted Checkout</span>
                </div>
             </div>
          </div>
       </div>
    </div>
  );

  const AboutView = () => (
    <div id="about" className="max-w-4xl mx-auto px-6 py-32 min-h-screen flex items-center justify-center flex-col text-center">
       <h1 className="text-6xl md:text-8xl font-black text-white mb-8">
          KAABIL <span className="bg-accent text-charcoal px-2">KAPDE</span>WALA
       </h1>
       <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light mb-12">
          We exist in the intersection of nostalgia and industrialism. 
          Kaabil KapdeWala isn't just a store; it's a curation of the past, 
          reconstructed for a brutalist future. We hunt for the rare, the worn, 
          and the enduring.
       </p>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full mt-12">
          <div className="border-t border-accent pt-4">
             <h4 className="font-bold uppercase mb-2 text-accent">Sustainability</h4>
             <p className="text-sm text-gray-500">Zero new production. We circulate what already exists, reducing fashion's carbon footprint one garment at a time.</p>
          </div>
          <div className="border-t border-accent pt-4">
             <h4 className="font-bold uppercase mb-2 text-accent">Authenticity</h4>
             <p className="text-sm text-gray-500">Every item is verified, authenticated, and preserved. No fakes. No fast fashion. Just pure history.</p>
          </div>
          <div className="border-t border-accent pt-4">
             <h4 className="font-bold uppercase mb-2 text-accent">Curation</h4>
             <p className="text-sm text-gray-500">Hand-picked by our team of archivists who understand the cultural significance of every seam and stitch.</p>
          </div>
       </div>
    </div>
  );

  return (
    <div className="bg-charcoal min-h-screen text-lightgray font-sans selection:bg-accent selection:text-charcoal flex flex-col">
       {/* Update the logo passed to navbar if your navbar component takes a logo prop, otherwise check Navbar component */}
       <Navbar currentView={currentView} onNavigate={(v) => handleNavigate(v)} cartCount={cart.length} />
       
       <main className="flex-grow w-full" ref={containerRef}>
          {currentView === 'home' && <HomeView />}
          {currentView === 'shop' && <ShopView />}
          {currentView === 'product-view' && <ProductView />}
          {currentView === 'checkout' && <CheckoutView />}
          {currentView === 'about' && <AboutView />}
       </main>

       <Footer />
    </div>
  );
};

export default App;