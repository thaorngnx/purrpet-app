export interface Notification {
  _id: string;
  userId: string;
  action: string;
  message: string;
  seen: boolean;
  title: string;
  type: string;
  orderCode: string;
  createdAt: string;
  updatedAt: string;
}
