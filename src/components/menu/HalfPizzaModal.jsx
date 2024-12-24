import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { menuData } from '../../data/menuData';

const HalfPizzaModal = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [firstHalf, setFirstHalf] = useState(null);
  const [secondHalf, setSecondHalf] = useState(null);
  const { addHalfPizza } = useCart();

  // Combinar todas as pizzas disponíveis para meio a meio (exceto calzones e doces)
  const availablePizzas = [
    ...menuData.promocao || [],
    ...menuData.tradicionais || [],
    ...menuData.especiais || []
  ];

  const handleSelectFirst = (pizza) => {
    setFirstHalf(pizza);
    setStep(2);
  };

  const handleSelectSecond = (pizza) => {
    setSecondHalf(pizza);
    // Calcular preço e adicionar ao carrinho
    addHalfPizza(firstHalf, pizza);
    onClose();
  };

  const getHighestPrice = () => {
    if (!firstHalf || !secondHalf) return 0;
    return Math.max(firstHalf.price, secondHalf.price);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {step === 1 ? 'Escolha o primeiro sabor' : 'Escolha o segundo sabor'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4">
          {/* Visualização da pizza em construção */}
          {(firstHalf || secondHalf) && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-bold mb-2">Sua Pizza Meio a Meio</h3>
              <div className="flex gap-4">
                <div className="flex-1 p-4 bg-white rounded border">
                  <p className="font-medium">Primeiro Sabor:</p>
                  {firstHalf ? (
                    <div>
                      <p className="text-lg">{firstHalf.name}</p>
                      <p className="text-sm text-gray-600">{firstHalf.description}</p>
                    </div>
                  ) : (
                    <p className="text-gray-400">Selecione o primeiro sabor</p>
                  )}
                </div>
                <div className="flex-1 p-4 bg-white rounded border">
                  <p className="font-medium">Segundo Sabor:</p>
                  {secondHalf ? (
                    <div>
                      <p className="text-lg">{secondHalf.name}</p>
                      <p className="text-sm text-gray-600">{secondHalf.description}</p>
                    </div>
                  ) : (
                    <p className="text-gray-400">Selecione o segundo sabor</p>
                  )}
                </div>
              </div>
              <p className="mt-4 text-right font-bold">
                Preço: R$ {getHighestPrice().toFixed(2)}
              </p>
            </div>
          )}

          {/* Lista de pizzas disponíveis */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availablePizzas.map(pizza => (
              <button
                key={pizza.id}
                onClick={() => step === 1 ? handleSelectFirst(pizza) : handleSelectSecond(pizza)}
                className="p-4 border rounded-lg hover:bg-gray-50 text-left transition-colors"
                disabled={step === 2 && pizza.id === firstHalf?.id}
              >
                <h3 className="font-bold">{pizza.name}</h3>
                <p className="text-sm text-gray-600">{pizza.description}</p>
                <p className="text-red-600 font-bold mt-2">R$ {pizza.price.toFixed(2)}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HalfPizzaModal;