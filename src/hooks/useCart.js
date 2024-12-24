import { create } from 'zustand';

const STORE_ADDRESS = "Xavier da silveira 1811- Santa Cecília";
const DELIVERY_RATE_PER_KM = 1;

export const useCart = create((set, get) => ({
  cart: [],
  isCartOpen: false,
  deliveryAddress: '',
  distance: 0,
  paymentAmount: 0,
  paymentMethod: 'pix',
  isHalfPizzaModalOpen: false,
  deliveryType: 'delivery',

  setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
  setHalfPizzaModalOpen: (isOpen) => set({ isHalfPizzaModalOpen: isOpen }),
  
  setDeliveryAddress: async (address) => {
    if (!address) {
      set({ deliveryAddress: '', distance: 0 });
      return;
    }
    // Simulação de cálculo de distância - implementar API Google Maps
    const distance = 17; // Valor fixo para teste
    set({ deliveryAddress: address, distance });
  },

  setPaymentMethod: (method) => set({ paymentMethod: method }),
  setPaymentAmount: (amount) => set({ paymentAmount: parseFloat(amount) || 0 }),
  
  addToCart: (item) => {
    const cart = get().cart;
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      set({
        cart: cart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      });
    } else {
      set({ cart: [...cart, { ...item, quantity: 1 }] });
    }
  },

  addHalfPizza: (firstHalf, secondHalf) => {
    const highestPrice = Math.max(firstHalf.price, secondHalf.price);
    const halfPizzaId = `half-${firstHalf.id}-${secondHalf.id}`;
    
    const halfPizza = {
      id: halfPizzaId,
      name: `Pizza Meio a Meio`,
      price: highestPrice,
      description: `½ ${firstHalf.name} + ½ ${secondHalf.name}`,
      details: {
        firstHalf: { name: firstHalf.name, description: firstHalf.description },
        secondHalf: { name: secondHalf.name, description: secondHalf.description }
      },
      isHalfPizza: true
    };

    get().addToCart(halfPizza);
  },

  removeFromCart: (itemId) => {
    set({ cart: get().cart.filter(item => item.id !== itemId) });
  },

  updateQuantity: (itemId, newQuantity) => {
    if (newQuantity < 1) {
      get().removeFromCart(itemId);
      return;
    }
    set({
      cart: get().cart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    });
  },

  getCartItemsCount: () => {
    return get().cart.reduce((total, item) => total + item.quantity, 0);
  },

  getSubtotal: () => {
    return get().cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  getDeliveryFee: () => {
    if (get().deliveryType === 'pickup') return 0;
    return get().distance * DELIVERY_RATE_PER_KM;
  },

  getTotal: () => {
    return get().getSubtotal() + get().getDeliveryFee();
  },

  getChange: () => {
    if (get().paymentMethod !== 'money') return 0;
    return Math.max(0, get().paymentAmount - get().getTotal());
  },

  clearCart: () => {
    set({
      cart: [],
      deliveryAddress: '',
      distance: 0,
      paymentAmount: 0,
      paymentMethod: 'pix',
      deliveryType: 'delivery'
    });
  }
}));