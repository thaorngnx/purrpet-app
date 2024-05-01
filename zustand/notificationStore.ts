import { create } from 'zustand';
import { getAllNotifications, markAllAsRead } from '../api/notification';
import {
  Notification,
  NotificationRequestParams,
} from '../interface/Notification';
import { Pagination } from '../interface/Pagination';

type NotificationState = {
  loading: boolean;
  error: string;
  data: Notification;
};

type ListNotificationState = {
  loading: boolean;
  error: string;
  data: Notification[];
  pagination: Pagination;
};

type NotificationStore = {
  listNotificationState: ListNotificationState;
  getAllNotifications: (params: NotificationRequestParams) => void;
  markAllAsRead: () => void;
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  listNotificationState: {
    loading: false,
    error: '',
    data: [],
    pagination: {
      limit: 10,
      page: 1,
      total: 1,
    },
  },
  getAllNotifications: async (params) => {
    set({
      listNotificationState: {
        ...get().listNotificationState,
        loading: true,
      },
    });
    try {
      const res = await getAllNotifications(params);
      set({
        listNotificationState: {
          loading: false,
          error: '',
          data: res.data,
          pagination: res.pagination,
        },
      });
    } catch (error: any) {
      set({
        listNotificationState: {
          loading: false,
          error: error,
          data: [],
          pagination: { limit: 10, page: 1, total: 1 },
        },
      });
    }
  },
  markAllAsRead: async () => {
    set({
      listNotificationState: {
        ...get().listNotificationState,
        loading: true,
      },
    });
    try {
      const res = await markAllAsRead();
      set({
        listNotificationState: {
          loading: false,
          error: '',
          data: res.data,
          pagination: { limit: 10, page: 1, total: 1 },
        },
      });
    } catch (error: any) {
      set({
        listNotificationState: {
          loading: false,
          error: error,
          data: [],
          pagination: { limit: 10, page: 1, total: 1 },
        },
      });
    }
  },
}));
