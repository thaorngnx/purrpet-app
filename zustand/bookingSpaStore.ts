import { create } from 'zustand';
import { BookingSpa, BookingSpaRequestParams } from '../interface/BookingSpa';
import { getBookingSpas, getBookingSpaByCode } from '../api/bookingSpa';
import { Pagination } from '../interface/Pagination';

type BookingSpaState = {
  loading: boolean;
  error: string;
  data: BookingSpa;
};

type ListBookingSpaState = {
  loading: boolean;
  error: string;
  data: BookingSpa[];
  pagination: Pagination;
};

type BookingSpaStore = {
  bookingSpaState: BookingSpaState;
  listBookingSpaState: ListBookingSpaState;
  getBookingSpas: (params: BookingSpaRequestParams) => void;
  getBookingSpaByCode: (code: string) => void;
};

export const useBookingSpaStore = create<BookingSpaStore>((set, get) => ({
  bookingSpaState: {
    loading: false,
    error: '',
    data: {} as BookingSpa,
  },
  listBookingSpaState: {
    loading: false,
    error: '',
    data: [],
    pagination: {
      limit: 10,
      page: 1,
      total: 1,
    },
  },
  getBookingSpas: async (params: any) => {
    set({
      listBookingSpaState: {
        ...get().listBookingSpaState,
        loading: true,
      },
    });
    try {
      const res = await getBookingSpas(params);
      if (res.err === 0) {
        set({
          listBookingSpaState: {
            loading: false,
            error: '',
            data: res.data,
            pagination: res.pagination,
          },
        });
      } else {
        set({
          listBookingSpaState: {
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
        listBookingSpaState: {
          loading: false,
          error: error.message,
          data: [],
          pagination: {
            limit: 6,
            page: 1,
            total: 1,
          },
        },
      });
    }
  },
  getBookingSpaByCode: async (code: string) => {
    set({
      bookingSpaState: {
        ...get().bookingSpaState,
        loading: true,
      },
    });
    try {
      const res = await getBookingSpaByCode(code);
      if (res.err === 0) {
        set({
          bookingSpaState: {
            loading: false,
            error: '',
            data: res.data,
          },
        });
      } else {
        set({
          bookingSpaState: {
            loading: false,
            error: res.msg,
            data: {} as BookingSpa,
          },
        });
      }
    } catch (error: any) {
      set({
        bookingSpaState: {
          loading: false,
          error: error.message,
          data: {} as BookingSpa,
        },
      });
    }
  },
}));
