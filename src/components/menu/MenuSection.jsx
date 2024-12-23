import React from 'react';
import { Plus } from 'lucide-react';
import { useCart } from '../../hooks/useCart';

const MenuSection = ({ title, items }) => {
  const { addToCart } = useCart();

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
        {/* Overlay escuro para melhor contraste */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Conteúdo */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-white capitalize">{title}</h2>
          <div className="flex flex-wrap gap-4">
            {items.map(item => (
              <div 
                key={item.id} 
                className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg flex-1 basis-[300px] min-w-[300px] flex flex-col justify-between hover:bg-white/95 transition-all duration-300"
              >
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
            ))}
          </div>
        </div>

        {/* Aviso de borda grátis */}
        {title === 'promocao' && (
          <div className="mt-4 text-center text-yellow-400 font-bold text-lg">
            TODAS AS PIZZAS COM BORDAS DE CATUPIRY GRÁTIS!
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuSection;