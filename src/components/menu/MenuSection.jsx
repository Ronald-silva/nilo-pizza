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

  const isHalfPizzaAvailable = title.toLowerCase() !== 'calzones' && title.toLowerCase() !== 'doces';

  // Calcular número de colunas necessárias
  const columns = Math.ceil(items.length / 2);

  return (
    <div className="relative mb-8">
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

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* Header da Seção */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white capitalize">{title}</h2>
          {isHalfPizzaAvailable && (
            <button
              onClick={() => setHalfPizzaModalOpen(true)}
              className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors"
            >
              <Split className="inline-block mr-2 h-4 w-4" />
              Meio a Meio
            </button>
          )}
        </div>

        {/* Grid de Cards */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            alignItems: 'stretch'
          }}
          className="w-full"
        >
          {items.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
              style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
                <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-200">
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

      {/* Modal Meio a Meio */}
      {isHalfPizzaModalOpen && (
        <HalfPizzaModal onClose={() => setHalfPizzaModalOpen(false)} />
      )}
    </div>
  );
};

export default MenuSection;