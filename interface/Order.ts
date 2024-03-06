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
  customerAddress: {
    street: string;
    province: string;
    district: string;
    ward: string;
  };
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
