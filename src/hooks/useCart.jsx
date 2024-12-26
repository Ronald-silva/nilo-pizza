// src/hooks/useCart.jsx
import { create } from 'zustand';
import axios from 'axios';

const STORE_ADDRESS = "Xavier da silveira 1811- Santa Cecília";
const DELIVERY_TIERS = {
  TIER_1: { maxDistance: 2000, fee: 3 }, // 2km em metros
  TIER_2: { maxDistance: 4000, fee: 6 }  // 4km em metros
};

export const useCart = create((set, get) => ({
  cart: [],
  isCartOpen: false,
  deliveryAddress: '',
  distance: 0,
  routeDistance: 0,
  paymentAmount: 0,
  paymentMethod: 'pix',
  isHalfPizzaModalOpen: false,
  deliveryType: 'delivery',

  setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
  
  setHalfPizzaModalOpen: (isOpen) => set({ isHalfPizzaModalOpen: isOpen }),
  
  setDeliveryAddress: async (address) => {
    if (!address) {
      set({ deliveryAddress: '', distance: 0, routeDistance: 0 });
      return;
    }

    try {
      const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
      const response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json`, {
        params: {
          origins: STORE_ADDRESS,
          destinations: address,
          mode: 'driving',
          key: apiKey
        }
      });

      if (response.data.status === "OK") {
        const routeData = response.data.rows[0].elements[0];
        if (routeData.status === "OK") {
          const distanceInMeters = routeData.distance.value;
          set({ 
            deliveryAddress: address, 
            distance: distanceInMeters / 1000,
            routeDistance: distanceInMeters
          });
        }
      }
    } catch (error) {
      console.error("Erro ao calcular rota:", error);
      set({ 
        deliveryAddress: address,
        distance: 0,
        routeDistance: 0
      });
    }
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
    const firstHalfPrice = firstHalf.price / 2;
    const secondHalfPrice = secondHalf.price / 2;
    const totalPrice = firstHalfPrice + secondHalfPrice;
    
    const halfPizzaId = `half-${firstHalf.id}-${secondHalf.id}`;
    
    const halfPizza = {
      id: halfPizzaId,
      name: `Pizza Meio a Meio`,
      price: totalPrice,
      description: `½ ${firstHalf.name} + ½ ${secondHalf.name}`,
      details: {
        firstHalf: { 
          name: firstHalf.name, 
          description: firstHalf.description,
          price: firstHalfPrice 
        },
        secondHalf: { 
          name: secondHalf.name, 
          description: secondHalf.description,
          price: secondHalfPrice 
        }
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
    
    const distanceInMeters = get().routeDistance;
    
    if (distanceInMeters <= DELIVERY_TIERS.TIER_1.maxDistance) {
      return DELIVERY_TIERS.TIER_1.fee;
    }
    return DELIVERY_TIERS.TIER_2.fee;
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
      routeDistance: 0,
      paymentAmount: 0,
      paymentMethod: 'pix',
      deliveryType: 'delivery'
    });
  },

  setDeliveryType: (type) => set({ deliveryType: type })
}));