import React, { useState } from 'react';
import { X, Plus, Minus, MapPin, Clock, ShoppingCart } from 'lucide-react';
import { useCart } from '../../hooks/useCart';

const CartModal = () => {
  const { 
    cart,
    updateQuantity,
    removeFromCart,
    setDeliveryAddress,
    setPaymentMethod,
    setPaymentAmount,
    getSubtotal,
    getDeliveryFee,
    getTotal,
    getChange,
    setIsCartOpen,
    distance,
    deliveryType,
    setDeliveryType
  } = useCart();

  const [formData, setFormData] = useState({
    address: '',
    paymentMethod: 'pix',
    paymentAmount: ''
  });

  const handleDeliveryTypeChange = (type) => {
    setDeliveryType(type);
    if (type === 'pickup') {
      setFormData(prev => ({ ...prev, address: '' }));
      setDeliveryAddress('');
    }
  };

  const handleAddressChange = (e) => {
    const address = e.target.value;
    setFormData({ ...formData, address });
    setDeliveryAddress(address);
  };

  const handlePaymentMethodChange = (e) => {
    const method = e.target.value;
    setFormData({ ...formData, paymentMethod: method });
    setPaymentMethod(method);
  };

  const handlePaymentAmountChange = (e) => {
    const amount = e.target.value;
    setFormData({ ...formData, paymentAmount: amount });
    setPaymentAmount(amount);
  };

  const handleFinishOrder = () => {
    if (deliveryType === 'delivery' && !formData.address) {
      alert('Por favor, insira seu endereço de entrega');
      return;
    }

    const orderDetails = cart.map(item => {
      if (item.isHalfPizza) {
        return `${item.quantity}x ${item.name}\n   - Primeiro sabor: ${item.details.firstHalf.name}\n   - Segundo sabor: ${item.details.secondHalf.name}\n   R$ ${(item.price * item.quantity).toFixed(2)}`;
      }
      return `${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}`;
    }).join('\n');

    const subtotal = getSubtotal();
    const deliveryFee = getDeliveryFee();
    const total = getTotal();
    const change = getChange();

    const message = encodeURIComponent(
      `*🍕 Novo Pedido Nilo Pizza*\n\n` +
      `*Itens do Pedido:*\n${orderDetails}\n\n` +
      `*Resumo do Pedido:*\n` +
      `Subtotal: R$ ${subtotal.toFixed(2)}\n` +
      (deliveryType === 'delivery' 
        ? `Taxa de Entrega (${distance}km): R$ ${deliveryFee.toFixed(2)}\n` 
        : `*Retirada na loja*\n`) +
      `*Total: R$ ${total.toFixed(2)}*\n\n` +
      (deliveryType === 'delivery' 
        ? `📍 Endereço de entrega:\n${formData.address}\n\n` 
        : `🏪 Retirar no endereço:\n${STORE_ADDRESS}\n\n`) +
      `💳 Forma de pagamento: ${formData.paymentMethod.toUpperCase()}` +
      (formData.paymentMethod === 'money' 
        ? `\n💰 Valor informado: R$ ${formData.paymentAmount}\n🔄 Troco: R$ ${change.toFixed(2)}` 
        : '')
    );

    window.open(`https://wa.me/5585988098826?text=${message}`, '_blank');
    setIsCartOpen(false);
  };

  if (cart.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-lg w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Carrinho</h2>
            <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="text-center py-8">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">Seu carrinho está vazio</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Carrinho</h2>
            <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Tipo de Entrega */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex gap-4">
              <button
                onClick={() => handleDeliveryTypeChange('delivery')}
                className={`flex-1 p-4 rounded-lg flex flex-col items-center gap-2 border-2 transition-colors ${
                  deliveryType === 'delivery' 
                    ? 'border-red-600 bg-red-50' 
                    : 'border-gray-200 hover:border-red-300'
                }`}
              >
                <MapPin className={deliveryType === 'delivery' ? 'text-red-600' : 'text-gray-500'} />
                <span className={deliveryType === 'delivery' ? 'text-red-600 font-medium' : 'text-gray-500'}>
                  Entrega
                </span>
              </button>
              <button
                onClick={() => handleDeliveryTypeChange('pickup')}
                className={`flex-1 p-4 rounded-lg flex flex-col items-center gap-2 border-2 transition-colors ${
                  deliveryType === 'pickup' 
                    ? 'border-red-600 bg-red-50' 
                    : 'border-gray-200 hover:border-red-300'
                }`}
              >
                <Clock className={deliveryType === 'pickup' ? 'text-red-600' : 'text-gray-500'} />
                <span className={deliveryType === 'pickup' ? 'text-red-600 font-medium' : 'text-gray-500'}>
                  Retirar na Loja
                </span>
              </button>
            </div>
          </div>

          {/* Items do Carrinho */}
          {cart.map(item => (
            <div key={item.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  {item.isHalfPizza ? (
                    <div className="text-sm text-gray-600">
                      <p>½ {item.details.firstHalf.name}</p>
                      <p>½ {item.details.secondHalf.name}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">{item.description}</p>
                  )}
                  <p className="font-medium text-red-600">R$ {item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center text-red-600 hover:bg-red-50 rounded"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-red-600 hover:bg-red-50 rounded"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Endereço de Entrega (condicional) */}
          {deliveryType === 'delivery' && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="font-medium block mb-2">Endereço de Entrega</label>
              <input
                type="text"
                value={formData.address}
                onChange={handleAddressChange}
                className="w-full p-3 border rounded-lg"
                placeholder="Digite seu endereço completo"
                required
              />
            </div>
          )}

          {/* Forma de Pagamento */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="font-medium block mb-2">Forma de Pagamento</label>
            <select
              value={formData.paymentMethod}
              onChange={handlePaymentMethodChange}
              className="w-full p-3 border rounded-lg"
            >
              <option value="pix">PIX</option>
              <option value="card">Cartão</option>
              <option value="money">Dinheiro</option>
            </select>
          </div>

          {/* Campo de Troco */}
          {formData.paymentMethod === 'money' && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="font-medium block mb-2">Troco para</label>
              <input
                type="number"
                value={formData.paymentAmount}
                onChange={handlePaymentAmountChange}
                className="w-full p-3 border rounded-lg"
                placeholder="Digite o valor"
                min={getTotal()}
              />
            </div>
          )}

          {/* Resumo do Pedido */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>R$ {getSubtotal().toFixed(2)}</span>
            </div>
            {deliveryType === 'delivery' && (
              <div className="flex justify-between text-gray-600">
                <span>Taxa de Entrega ({distance}km):</span>
                <span>R$ {getDeliveryFee().toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total:</span>
              <span>R$ {getTotal().toFixed(2)}</span>
            </div>
            {formData.paymentMethod === 'money' && formData.paymentAmount && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>Troco:</span>
                <span>R$ {getChange().toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Botão Finalizar */}
        <div className="sticky bottom-0 bg-white p-4 border-t">
          <button
            onClick={handleFinishOrder}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Finalizar Pedido
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;