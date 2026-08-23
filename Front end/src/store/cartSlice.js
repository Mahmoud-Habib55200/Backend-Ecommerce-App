import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as cartApi from "../api/cart";
import { getErrorMessage } from "../api/errors";

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await cartApi.getCart();
      return res.data.data.cart;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const res = await cartApi.addCartItem(productId, quantity);
      return res.data.data.cart;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const res = await cartApi.updateCartItem(productId, quantity);
      return res.data.data.cart;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await cartApi.removeCartItem(productId);
      return res.data.data.cart;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await cartApi.clearCartApi();
      return res.data.data.cart;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

const emptyCart = { items: [], totalItems: 0, totalPrice: 0 };

const initialState = {
  cart: emptyCart,
  status: "idle",
  error: null,
};

const setCart = (state, action) => {
  state.status = "succeeded";
  state.cart = action.payload;
};

const setFailed = (state, action) => {
  state.status = "failed";
  state.error = action.payload;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Resets the locally-held cart without touching the server copy —
    // used on logout so the next user never sees the previous user's items.
    resetCart: (state) => {
      state.cart = emptyCart;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, setCart)
      .addCase(fetchCart.rejected, setFailed)
      .addCase(addToCart.fulfilled, setCart)
      .addCase(addToCart.rejected, setFailed)
      .addCase(updateQuantity.fulfilled, setCart)
      .addCase(updateQuantity.rejected, setFailed)
      .addCase(removeFromCart.fulfilled, setCart)
      .addCase(removeFromCart.rejected, setFailed)
      .addCase(clearCart.fulfilled, setCart)
      .addCase(clearCart.rejected, setFailed);
  },
});

export const { resetCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.cart.items;

export const selectCartCount = (state) => state.cart.cart.totalItems;

export const selectCartTotal = (state) => state.cart.cart.totalPrice;

export default cartSlice.reducer;
