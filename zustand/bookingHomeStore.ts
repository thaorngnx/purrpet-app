import { create } from 'zustand';
import {
  BookingHome,
  BookingHomeRequestParams,
} from '../interface/BookingHome';
import { getBookingHomes, getBookingHomeByCode } from '../api/bookingHome';
import { Pagination } from '../interface/Pagination';

type BookingHomeState = {
  loading: boolean;
  error: string;
  data: BookingHome;
};

type ListBookingHomeState = {
  loading: boolean;
  error: string;
  data: BookingHome[];
  pagination: Pagination;
};

type BookingHomeStore = {
  bookingHomeState: BookingHomeState;
  listBookingHomeState: ListBookingHomeState;
  getBookingHomes: (params: BookingHomeRequestParams) => void;
  getBookingHomeByCode: (code: string) => void;
};

export const useBookingHomeStore = create<BookingHomeStore>((set, get) => ({
  bookingHomeState: {
    loading: false,
    error: '',
    data: {} as BookingHome,
  },
  listBookingHomeState: {
    loading: false,
    error: '',
    data: [],
    pagination: {
      limit: 10,
      page: 1,
      total: 1,
    },
  },
  getBookingHomes: async (params: any) => {
    set({
      listBookingHomeState: {
        ...get().listBookingHomeState,
        loading: true,
      },
    });
    try {
      const res = await getBookingHomes(params);
      if (res.err === 0) {
        set({
          listBookingHomeState: {
            loading: false,
            error: '',
            data: res.data,
            pagination: res.pagination,
          },
        });
      } else {
        set({
          listBookingHomeState: {
            loading: false,
            error: res.message,
            data: [],
            pagination: {
              limit: 10,
              page: 1,
              total: 1,
            },
          },
        });
      }
    } catch (error) {
      set({
        listBookingHomeState: {
          loading: false,
          error: 'Something went wrong',
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
  getBookingHomeByCode: async (code: string) => {
    set({
      bookingHomeState: {
        ...get().bookingHomeState,
        loading: true,
      },
    });
    try {
      const res = await getBookingHomeByCode(code);
      if (res.error === 0) {
        set({
          bookingHomeState: {
            loading: false,
            error: '',
            data: res.data,
          },
        });
      } else {
        set({
          bookingHomeState: {
            loading: false,
            error: res.message,
            data: {} as BookingHome,
          },
        });
      }
    } catch (error) {
      set({
        bookingHomeState: {
          loading: false,
          error: 'Something went wrong',
          data: {} as BookingHome,
        },
      });
    }
  },
}));
