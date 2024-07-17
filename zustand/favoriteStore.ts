import { create } from 'zustand';
import {
  favoriteProduct,
  getFavorite,
  getFavoriteProductDetail,
} from '../api/favorite';
import { Product } from '../interface/Product';

type ListFavoriteState = {
  loading: boolean;
  error: string;
  data: String[];
};

type ListFavoriteDetailState = {
  loading: boolean;
  error: string;
  data: Product[];
};

type FavoriteStore = {
  listFavoriteState: ListFavoriteState;
  listFavoriteDetailState: ListFavoriteDetailState;
  getFavorite: (params: any) => void;
  getFavoriteProductDetail: (params: any) => void;
  favoriteProduct: (productCode: string) => void;
};

export const useFavoriteStore = create<FavoriteStore>((set, get) => ({
  listFavoriteState: {
    loading: false,
    error: '',
    data: [],
  },
  listFavoriteDetailState: {
    loading: false,
    error: '',
    data: [],
  },
  getFavorite: async (params: any) => {
    set({
      listFavoriteState: {
        ...get().listFavoriteState,
        loading: true,
      },
    });
    try {
      const res = await getFavorite(params);
      set({
        listFavoriteState: {
          loading: false,
          error: '',
          data: res.data,
        },
      });
    } catch (error: any) {
      set({
        listFavoriteState: {
          loading: false,
          error: error,
          data: [],
        },
      });
    }
  },
  getFavoriteProductDetail: async (params: any) => {
    set({
      listFavoriteDetailState: {
        ...get().listFavoriteDetailState,
        loading: true,
      },
    });
    try {
      const res = await getFavoriteProductDetail(params);
      set({
        listFavoriteDetailState: {
          loading: false,
          error: '',
          data: res.data,
        },
      });
    } catch (error: any) {
      set({
        listFavoriteDetailState: {
          loading: false,
          error: error,
          data: [],
        },
      });
    }
  },
  favoriteProduct: async (productCode: string) => {
    try {
      const res = await favoriteProduct(productCode);
      if (res.err === 0) {
        get().getFavorite({});
      }
    } catch (error: any) {
      console.error(error);
    }
  },
}));
