import { create } from 'zustand';

export const useCart = create((set, get) => ({
  cart: [],
  isCartOpen: false,
  
  setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
  
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
  }
}));