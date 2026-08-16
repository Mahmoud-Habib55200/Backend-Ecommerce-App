import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as productsApi from "../api/products";
import { getErrorMessage } from "../api/errors";

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await productsApi.getProducts(params);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await productsApi.getCategories();
      return res.data.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const fetchFeaturedProducts = createAsyncThunk(
  "products/fetchFeatured",
  async (_, { rejectWithValue }) => {
    try {
      const res = await productsApi.getFeaturedProducts();
      return res.data.data.products;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const fetchLatestProducts = createAsyncThunk(
  "products/fetchLatest",
  async (_, { rejectWithValue }) => {
    try {
      const res = await productsApi.getLatestProducts();
      return res.data.data.products;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await productsApi.getProductById(id);
      return res.data.data.product;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

const initialState = {
  items: [],
  page: 1,
  totalPages: 1,
  totalProducts: 0,
  status: "idle",
  error: null,
  categories: [],
  categoriesStatus: "idle",
  featuredItems: [],
  featuredStatus: "idle",
  latestItems: [],
  latestStatus: "idle",
  currentProduct: null,
  currentProductStatus: "idle",
  currentProductError: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
      state.currentProductStatus = "idle";
      state.currentProductError = null;
    },
  },
  extraReducers: (builder) => {
    builder
    
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.products;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalProducts = action.payload.totalProducts;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })


      
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesStatus = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesStatus = "succeeded";
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.categoriesStatus = "failed";
      })



      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.featuredStatus = "loading";
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featuredStatus = "succeeded";
        state.featuredItems = action.payload;
      })
      .addCase(fetchFeaturedProducts.rejected, (state) => {
        state.featuredStatus = "failed";
      })

      
      .addCase(fetchLatestProducts.pending, (state) => {
        state.latestStatus = "loading";
      })
      .addCase(fetchLatestProducts.fulfilled, (state, action) => {
        state.latestStatus = "succeeded";
        state.latestItems = action.payload;
      })
      .addCase(fetchLatestProducts.rejected, (state) => {
        state.latestStatus = "failed";
      })


      .addCase(fetchProductById.pending, (state) => {
        state.currentProductStatus = "loading";
        state.currentProductError = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.currentProductStatus = "succeeded";
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.currentProductStatus = "failed";
        state.currentProductError = action.payload;
      });
  },
});

export const { clearCurrentProduct } = productsSlice.actions;

export default productsSlice.reducer;
