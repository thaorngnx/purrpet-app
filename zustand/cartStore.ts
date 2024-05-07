import { create } from 'zustand';
import {
  addToCart,
  deleteCart,
  deleteProductCart,
  getCart,
  updateCart,
} from '../api/cart';

type CartState = {
  loading: boolean;
  error: string;
  data: any;
};

type CartStore = {
  cartState: CartState;
  addToCart: (cart: any) => void;
  getCart: () => void;
  updateCart: (cart: any) => void;
  deleteCart: () => void;
  deleteProductCart: (product: any) => void;
};

export const useCartStore = create<CartStore>((set, get) => ({
  cartState: {
    loading: false,
    error: '',
    data: {},
  },
  addToCart: async (cart: any) => {
    set({
      cartState: {
        ...get().cartState,
        loading: true,
      },
    });
    try {
      const res = await addToCart(cart);
      console.log('res', res);
      set({
        cartState: {
          loading: false,
          error: '',
          data: res,
        },
      });
    } catch (error: any) {
      set({
        cartState: {
          loading: false,
          error: error,
          data: {},
        },
      });
    }
  },
  getCart: async () => {
    set({
      cartState: {
        ...get().cartState,
        loading: true,
      },
    });
    try {
      const res = await getCart();
      set({
        cartState: {
          loading: false,
          error: '',
          data: res,
        },
      });
    } catch (error: any) {
      set({
        cartState: {
          loading: false,
          error: error,
          data: {},
        },
      });
    }
  },
  updateCart: async (cart) => {
    set({
      cartState: {
        ...get().cartState,
        loading: true,
      },
    });
    try {
      const res = await updateCart(cart);
      set({
        cartState: {
          loading: false,
          error: '',
          data: res,
        },
      });
    } catch (error: any) {
      set({
        cartState: {
          loading: false,
          error: error,
          data: {},
        },
      });
    }
  },
  deleteCart: async () => {
    set({
      cartState: {
        ...get().cartState,
        loading: true,
      },
    });
    try {
      const res = await deleteCart();
      set({
        cartState: {
          loading: false,
          error: '',
          data: res,
        },
      });
    } catch (error: any) {
      set({
        cartState: {
          loading: false,
          error: error,
          data: {},
        },
      });
    }
  },
  deleteProductCart: async (product: any) => {
    set({
      cartState: {
        ...get().cartState,
        loading: true,
      },
    });
    try {
      const res = await deleteProductCart(product);
      set({
        cartState: {
          loading: false,
          error: '',
          data: res,
        },
      });
    } catch (error: any) {
      set({
        cartState: {
          loading: false,
          error: error,
          data: {},
        },
      });
    }
  },
}));
