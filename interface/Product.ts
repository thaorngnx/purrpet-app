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
  averageRating?: number;
  orderQuantity?: number;
}

export interface ProductDetail {
  product: Product;
  rating: Rating;
}

export interface Rating {
  starRate: {
    oneStar: number;
    twoStar: number;
    threeStar: number;
    fourStar: number;
    fiveStar: number;
  };
  reviews: Review[];
}

export interface Review {
  productCode?: string;
  orderCode?: string;
  rating?: number;
  comment?: string;
  createdAt?: string;
  user?: {
    _id: string;
    name: string;
  };
}
