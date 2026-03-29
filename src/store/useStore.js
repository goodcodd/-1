import { create } from 'zustand';

/** Глобальний кошик: спільний стан для сторінки товару та навігації */
export const useCartStore = create((set) => ({
  items: [],

  addToCart: (product, quantity) => {
    if (!product || quantity <= 0) return;

    set((state) => {
      const existing = state.items.find((i) => i.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === product.id
              ? { ...i, quantity: i.quantity + quantity }
              : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            id: product.id,
            title: product.title,
            price: product.price,
            quantity,
          },
        ],
      };
    });
  },

  removeLine: (productId) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== productId),
    })),

  clearCart: () => set({ items: [] }),
}));

export const selectTotalItems = (state) =>
  state.items.reduce((sum, line) => sum + line.quantity, 0);

export const selectTotalPrice = (state) =>
  state.items.reduce((sum, line) => sum + line.price * line.quantity, 0);

export { useCartStore as useStore };
