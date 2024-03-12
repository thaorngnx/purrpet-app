export interface Product {
  _id: string;
  purrPetCode: string;
  productName: string;
  description: string;
  price: number;
  categoryCode: string;
  images: [
    {
      path: string;
    },
  ];
  inventory: string;
  star: string;
}
