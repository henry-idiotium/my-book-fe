import { fetchProduct, productAdapter, productReducer } from './product.slice';

describe('product reducer', () => {
  it('should handle initial state', () => {
    const expected = productAdapter.getInitialState({
      loadingStatus: 'not loaded',
      error: null,
    });

    expect(productReducer(undefined, { type: '' })).toEqual(expected);
  });

  it('should handle fetchProducts', () => {
    let state = productReducer(undefined, fetchProduct.pending(null, null));

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'loading',
        error: null,
        entities: {},
      })
    );

    state = productReducer(
      state,
      fetchProduct.fulfilled([{ id: 1 }], null, null)
    );

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'loaded',
        error: null,
        entities: { 1: { id: 1 } },
      })
    );

    state = productReducer(
      state,
      fetchProduct.rejected(new Error('Uh oh'), null, null)
    );

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'error',
        error: 'Uh oh',
        entities: { 1: { id: 1 } },
      })
    );
  });
});
