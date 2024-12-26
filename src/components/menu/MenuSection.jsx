// src/components/menu/MenuSection.jsx
import React from 'react';
import { Plus, Split } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import HalfPizzaModal from './HalfPizzaModal';

const MenuSection = ({ title, items }) => {
  const { 
    addToCart, 
    isHalfPizzaModalOpen, 
    setHalfPizzaModalOpen 
  } = useCart();

  return (
    <div className="mb-8 relative">
      {/* Background com overlay */}
      <div 
        className="fixed inset-0 z-0" 
        style={{
          backgroundImage: 'url("/images/pizza-background.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6 px-4">
            <h2 className="text-2xl font-bold text-white capitalize">{title}</h2>
            <button
              onClick={() => setHalfPizzaModalOpen(true)}
              className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors"
            >
              <Split className="inline-block mr-2 h-4 w-4" />
              Meio a Meio
            </button>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            {items.map(item => (
              <div
                key={item.id}
                className="w-full md:w-1/2 lg:w-1/3 p-2"
              >
                <div className="bg-white rounded-lg p-6 shadow-lg h-full flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-xl mb-2">{item.name}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                    <span className="text-red-600 font-bold text-lg">
                      R$ {item.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-red-600 hover:bg-red-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-md"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isHalfPizzaModalOpen && (
        <HalfPizzaModal onClose={() => setHalfPizzaModalOpen(false)} />
      )}
    </div>
  );
};

export default MenuSection;