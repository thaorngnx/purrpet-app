import { create } from 'zustand';
import { Order, OrderRequestParams } from '../interface/Order';
import { getOrderByCode, getOrders } from '../api/order';
import { Pagination } from '../interface/Pagination';

type OrderState = {
  loading: boolean;
  error: string;
  data: Order;
};

type ListOrderState = {
  loading: boolean;
  error: string;
  data: Order[];
  pagination: Pagination;
};

type OrderStore = {
  orderState: OrderState;
  listOrderState: ListOrderState;
  getOrders: (params: OrderRequestParams) => void;
  getOrderByCode: (purrPetCode: string) => void;
};

export const useOrderStore = create<OrderStore>((set, get) => ({
  orderState: {
    loading: false,
    error: '',
    data: {} as Order,
    pagination: {
      limit: 10,
      page: 1,
      totalPage: 1,
    },
  },
  listOrderState: {
    loading: false,
    error: '',
    data: [],
    pagination: {
      limit: 10,
      page: 1,
      total: 1,
    },
  },
  getOrders: async (params: OrderRequestParams) => {
    set({
      listOrderState: {
        ...get().listOrderState,
        loading: true,
      },
    });
    try {
      const res = await getOrders(params);
      if (res.err === 0) {
        set({
          listOrderState: {
            loading: false,
            error: '',
            data: res.data,
            pagination: res.pagination,
          },
        });
      } else {
        set({
          listOrderState: {
            loading: false,
            error: res.msg,
            data: [],
            pagination: {
              limit: 10,
              page: 1,
              total: 1,
            },
          },
        });
      }
    } catch (error: any) {
      set({
        listOrderState: {
          loading: false,
          error: error.message,
          data: [],
          pagination: {
            limit: 10,
            page: 1,
            total: 1,
          },
        },
      });
    }
  },
  getOrderByCode: async (purrPetCode: string) => {
    set({
      orderState: {
        ...get().orderState,
        loading: true,
      },
    });
    try {
      const res = await getOrderByCode(purrPetCode);
      if (res.err === 0) {
        set({
          orderState: {
            loading: false,
            error: '',
            data: res.data,
          },
        });
      } else {
        set({
          orderState: {
            loading: false,
            error: res.msg,
            data: {} as Order,
          },
        });
      }
    } catch (error: any) {
      set({
        orderState: {
          loading: false,
          error: error.message,
          data: {} as Order,
        },
      });
    }
  },
}));
