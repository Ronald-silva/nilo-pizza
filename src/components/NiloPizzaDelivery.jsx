import React from 'react';
import Header from './layout/Header';
import MenuSection from './menu/MenuSection';
import CartModal from './cart/CartModal';
import { useCart } from '../hooks/useCart';
import { menuData } from '../data/menuData';

{Object.keys(menuData).map(category => (
  <MenuSection key={category} title={category} />
))}

const NiloPizzaDelivery = () => {
  const { cart, isCartOpen, setIsCartOpen } = useCart();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header cartCount={cart.length} onCartClick={() => setIsCartOpen(true)} />
      
      <main className="container mx-auto p-4">
        {Object.entries(menuData).map(([section, items]) => (
          <MenuSection key={section} title={section} items={items} />
        ))}
      </main>

      {isCartOpen && <CartModal onClose={() => setIsCartOpen(false)} />}
    </div>
  );
};

export default NiloPizzaDelivery;