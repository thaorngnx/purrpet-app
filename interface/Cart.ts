export interface ProductCartInfo {
  purrPetCode: string;
  productName: string;
  description: string;
  price: number;
  images: [
    {
      path: string;
    },
  ];
  star: number;
  status: string;
  inventory: string;
  categoryCode: string;
  createdAt: string;
  updatedAt: string;
  quantity: number;
  totalPrice: number;
  priceDiscount: number;
  discountQuantity: number;
}
