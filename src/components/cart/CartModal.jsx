import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { Button } from '../ui/button';
import { useCart } from '../../hooks/useCart';

const CartModal = ({ onClose }) => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const [deliveryType, setDeliveryType] = useState('pickup');
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [address, setAddress] = useState('');
  const [change, setChange] = useState('');

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const formatPrice = (price) => {
    return `R$ ${price.toFixed(2)}`;
  };

  const handleFinishOrder = () => {
    const orderDetails = cart.map(item =>
      `${item.quantity}x ${item.name} - ${formatPrice(item.price * item.quantity)}`
    ).join('\n');

    const deliveryInfo = deliveryType === 'delivery' 
      ? `\nEndereço: ${address}` 
      : '\nRetirada na loja';
    
    const paymentInfo = `\nPagamento: ${paymentMethod}${
      paymentMethod === 'money' ? `\nTroco para: R$ ${change}` : ''
    }`;
    
    const message = encodeURIComponent(
      `*Novo Pedido*\n\n${orderDetails}\n\nTotal: ${formatPrice(calculateTotal())}${deliveryInfo}${paymentInfo}`
    );
    
    window.open(`https://wa.me/5585991993833?text=${message}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-4 max-w-lg w-full m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Carrinho</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        {cart.length === 0 ? (
          <p className="text-center text-gray-500 my-4">Carrinho vazio</p>
        ) : (
          <>
            {/* Items do Carrinho */}
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-gray-600">{formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Formulário de Pedido */}
            <div className="mt-4 space-y-4">
              {/* Tipo de Entrega */}
              <div>
                <label className="block mb-2 font-medium">Tipo de Entrega</label>
                <select
                  value={deliveryType}
                  onChange={(e) => setDeliveryType(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="pickup">Coletar na loja</option>
                  <option value="delivery">Entrega a domicílio</option>
                </select>
              </div>

              {/* Endereço (condicional) */}
              {deliveryType === 'delivery' && (
                <div>
                  <label className="block mb-2 font-medium">Endereço</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Digite seu endereço completo"
                  />
                </div>
              )}

              {/* Forma de Pagamento */}
              <div>
                <label className="block mb-2 font-medium">Forma de Pagamento</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="pix">PIX</option>
                  <option value="card">Cartão</option>
                  <option value="money">Dinheiro</option>
                </select>
              </div>

              {/* Troco (condicional) */}
              {paymentMethod === 'money' && (
                <div>
                  <label className="block mb-2 font-medium">Troco para</label>
                  <input
                    type="text"
                    value={change}
                    onChange={(e) => setChange(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Digite o valor para troco"
                  />
                </div>
              )}

              {/* Total e Botão de Finalizar */}
              <div className="border-t pt-4">
                <div className="text-xl font-bold mb-4">
                  Total: {formatPrice(calculateTotal())}
                </div>
                <Button
                  onClick={handleFinishOrder}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
                >
                  Finalizar Pedido
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartModal;