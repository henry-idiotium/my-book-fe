import {
  TypedUseSelectorHook,
  useDispatch as useBaseDispatch,
  useSelector as useBaseSelector,
} from 'react-redux';

import { AppDispatch, RootState } from '@/stores';

export const useDispatch: () => AppDispatch = useBaseDispatch;
export const useSelector: TypedUseSelectorHook<RootState> = useBaseSelector;
