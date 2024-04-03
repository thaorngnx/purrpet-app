import { create } from 'zustand';
import { getActiveCategories } from '../api/category';
import { Category } from '../interface/Category';
import * as CONST from '../screens/constants';

type CategoryState = {
  loading: boolean;
  error: string;
  data: Category[];
};

type CategoryStore = {
  categoryState: CategoryState;
  getActiveCategories: () => void;
};

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categoryState: {
    loading: false,
    error: '',
    data: [],
  },
  getActiveCategories: async () => {
    set({
      categoryState: {
        ...get().categoryState,
        loading: true,
      },
    });
    try {
      const res = await getActiveCategories({
        categoryType: CONST.CATEGORY_TYPE.PRODUCT,
      });
      set({
        categoryState: {
          loading: false,
          error: '',
          data: res.data,
        },
      });
    } catch (error: any) {
      set({
        categoryState: {
          ...get().categoryState,
          loading: false,
          error: error.message,
        },
      });
    }
  },
}));
