export interface Order {
  purrPetCode: string;
  orderItems: [
    {
      productCode: string;
      image: string;
      quantity: number;
      productPrice: number;
      totalPrice: number;
    },
  ];
  orderPrice: number;
  customerCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: {
    street: string;
    province: string;
    district: string;
    ward: string;
  };
  customerNote: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderResponse {
  error: number;
  message: string;
  data: Order[];
  totalPage: number;
}

export interface OrderRequestParams {
  page: number;
  limit: number;
  order: string;
  key: string;
  fromDate: Date;
  toDate: Date;
  status: string;
}
