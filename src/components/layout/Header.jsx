import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../hooks/useCart';

const Header = () => {
  const { setIsCartOpen, getCartItemsCount } = useCart();
  const itemCount = getCartItemsCount();

  return (
    <header className="bg-red-600 text-white py-4 px-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/images/logo-nilo.png" alt="Nilo Pizza" className="w-12 h-12 rounded-lg" />
          <h1 className="text-2xl font-bold">Nilo Pizza</h1>
        </div>
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative p-2"
        >
          <ShoppingCart className="w-6 h-6" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;