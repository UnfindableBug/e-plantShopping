// src/CartSlice.jsx
import { createSlice } from '@reduxjs/toolkit';

// Optional: normalize "$15" -> 15
const toNumber = (val) => {
  if (typeof val === 'number') return val;
  const n = Number(String(val).replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

const initialState = {
  // each item shape: { name, image, description, cost: "$15", price: 15, qty: 1 }
  items: [],
};

export const CartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // payload: a plant object (at least { name, image, description, cost })
    addItem: (state, action) => {
      const p = action.payload;
      const idx = state.items.findIndex(i => i.name === p.name);
      if (idx >= 0) {
        state.items[idx].qty += 1;
      } else {
        state.items.push({
          ...p,
          price: toNumber(p.cost),
          qty: 1,
        });
      }
    },

    // payload: string -> the item's name to remove
    removeItem: (state, action) => {
      const name = action.payload;
      state.items = state.items.filter(i => i.name !== name);
    },

    // payload: { name, amount } -> set quantity to "amount"
    // If amount <= 0, remove the item (common UX behavior)
    updateQuantity: (state, action) => {
      const { name, amount } = action.payload || {};
      const idx = state.items.findIndex(i => i.name === name);
      if (idx === -1) return;

      if (amount <= 0) {
        state.items.splice(idx, 1);
      } else {
        state.items[idx].qty = amount;
      }
    },
  },
});

export const { addItem, removeItem, updateQuantity } = CartSlice.actions;
export default CartSlice.reducer;
