import React from 'react';
import { NavProps } from '../types';

export const Navbar: React.FC<NavProps> = ({ currentView, onNavigate, cartCount }) => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-charcoal/90 backdrop-blur-md border-b border-slate transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="text-2xl font-black tracking-tighter cursor-pointer group transition-colors"
          onClick={() => onNavigate('home')}
        >
          <span className="group-hover:text-accent transition-colors">KAABIL </span>
          <span className="bg-accent text-charcoal px-1">KAPDE</span>
          <span className="group-hover:text-accent transition-colors">WALA</span>
        </div>

        {/* Links */}
        <div className="hidden md:flex space-x-12 text-sm font-medium tracking-wide">
          <button 
            onClick={() => onNavigate('home')} 
            className={`hover:text-accent transition-colors uppercase ${currentView === 'home' ? 'text-accent' : 'text-lightgray'}`}
          >
            Home
          </button>
          <button 
            onClick={() => onNavigate('shop')} 
            className={`hover:text-accent transition-colors uppercase ${currentView === 'shop' ? 'text-accent' : 'text-lightgray'}`}
          >
            Shop
          </button>
          <button 
            onClick={() => onNavigate('about')} 
            className={`hover:text-accent transition-colors uppercase ${currentView === 'about' ? 'text-accent' : 'text-lightgray'}`}
          >
            About
          </button>
        </div>

        {/* Cart */}
        <div 
          className="relative cursor-pointer group"
          onClick={() => onNavigate('checkout')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-accent transition-colors">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-accent text-charcoal text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </div>
      </div>
    </nav>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-charcoal border-t border-slate py-16 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h3 className="text-xl font-black tracking-tighter mb-4">KAABIL KAPDEWALA</h3>
          <p className="text-gray-500 text-sm max-w-xs">
            Curated archival fashion for the modern brutalist. 
            Sustainable. Timeless. Essential.
          </p>
        </div>
        <div className="flex space-x-8 mt-8 md:mt-0 text-sm text-gray-400">
          <a href="#" className="hover:text-accent transition-colors">Shipping</a>
          <a href="#" className="hover:text-accent transition-colors">Returns</a>
          <a href="#" className="hover:text-accent transition-colors">Instagram</a>
          <a href="#" className="hover:text-accent transition-colors">TikTok</a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-12 text-xs text-gray-600">
        © 2024 Kaabil KapdeWala. All rights reserved.
      </div>
    </footer>
  );
};