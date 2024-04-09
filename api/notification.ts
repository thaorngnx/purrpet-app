import api from './token';

export const getAllNotifications = async () => {
  try {
    const response = await api.get('notification/get-all');
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const markAllAsRead = async () => {
  try {
    const response = await api.put('notification/mark-all-as-read');
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const viewNotification = async (notificationId: string) => {
  try {
    const response = await api.get(`notification/view/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
