import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';

import { RootState } from '..';

import { getProductById, getProducts } from '@/api';
import { ProductEntity, SliceStatus } from '@/types';

export const PRODUCT_FEATURE_KEY = 'product';

export type ProductState = EntityState<ProductEntity> & SliceStatus;

export const productAdapter = createEntityAdapter<ProductEntity>({
  selectId: (product) => product.id,
  sortComparer: (prev, next) => prev.name.localeCompare(next.name),
});

// thunks
export const fetchProduct = createAsyncThunk(
  'product/fetchProducts',
  async (fooo, thunkAPI) => await getProducts()
);
export const fetchProductById = createAsyncThunk<
  ProductEntity,
  ProductEntity['id']
>('product/fetchProductById', async (id, thunkAPI) => await getProductById(id));

// slice
export const initialState: ProductState = productAdapter.getInitialState({
  loadingStatus: 'not loaded',
});
export const productSlice = createSlice({
  name: PRODUCT_FEATURE_KEY,
  initialState,
  reducers: {
    add: productAdapter.addOne,
    // remove: productAdapter.removeOne,
    // update: productAdapter.updateOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduct.pending, (state) => {
        state.loadingStatus = 'loading';
      })
      .addCase(
        fetchProduct.fulfilled,
        (state, action: PayloadAction<ProductEntity[]>) => {
          productAdapter.setAll(state, action.payload);
          state.loadingStatus = 'loaded';
        }
      )
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loadingStatus = 'error';
        state.error = action.error.message;
      });
  },
});
export const productReducer = productSlice.reducer;
export const productActions = productSlice.actions;

// selectors
const { selectAll, selectEntities, selectById } = productAdapter.getSelectors();

export const selectProductState = (rootState: RootState) =>
  rootState[PRODUCT_FEATURE_KEY] as ProductState;

export const selectAllProduct = createSelector(selectProductState, selectAll);
export const selectProductEntities = createSelector(
  selectProductState,
  selectEntities
);
export const selectProductById = (id: ProductEntity['id']) => {
  return createSelector(selectProductState, (state) => selectById(state, id));
};
