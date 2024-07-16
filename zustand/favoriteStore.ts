import { create } from 'zustand';
import { favoriteProduct, getFavorite } from '../api/favorite';
import { Favorite } from '../interface/Favorite';

type ListFavoriteState = {
  loading: boolean;
  error: string;
  data: Favorite[];
};

type FavoriteStore = {
  listFavoriteState: ListFavoriteState;
  getFavorite: (params: any) => void;
  favoriteProduct: (productCode: string) => void;
};

export const useFavoriteStore = create<FavoriteStore>((set, get) => ({
  listFavoriteState: {
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
