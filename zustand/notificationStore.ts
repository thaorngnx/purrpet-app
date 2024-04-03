import { create } from 'zustand';
import { getAllNotifications } from '../api/notification';

type NotificationState = {
  loading: boolean;
  error: string;
  data: any;
};

type NotificationStore = {
  notificationState: NotificationState;
  getAllNotifications: () => void;
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notificationState: {
    loading: false,
    error: '',
    data: {},
  },
  getAllNotifications: async () => {
    set({
      notificationState: {
        ...get().notificationState,
        loading: true,
      },
    });
    try {
      const res = await getAllNotifications();
      set({
        notificationState: {
          loading: false,
          error: '',
          data: res.data,
        },
      });
    } catch (error: any) {
      set({
        notificationState: {
          loading: false,
          error: error,
          data: {},
        },
      });
    }
  },
}));
