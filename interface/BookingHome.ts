export interface BookingHome {
  purrPetCode: string;
  petName: string;
  homeCode: string;
  bookingHomePrice: number;
  customerCode: string;
  customerNote: string;
  dateCheckIn: Date;
  dateCheckOut: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingHomeResponse {
  err: number;
  message: string;
  data: BookingHome[];
  totalPage: number;
}
export interface BookingHomeDetail {
  purrPetCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerNote: string;
  petName: string;
  dateCheckIn: string;
  dateCheckOut: string;
  numberOfDay: number;
  bookingHomePrice: number;
  status: string;
  createdAt: string;
  totalPayment: number;
  pointUsed: number;
  useCoin: number;
  payMethod: string;
  homestay?: {
    purrPetCode?: string;
    homeType?: string;
    categoryName?: string;
    masterDataName?: string;
    price?: number;
  };
}

export interface BookingHomeInfo {
  petName: string;
  homeCode: string;
  bookingHomePrice: number;
  customerCode: string;
  customerNote: string;
  homeSize: string;
  petType: string;
  categoryName: string;
  categoryCode: string;
  dateCheckIn: any;
  dateCheckOut: any;
  homePrice: number;
  // payMethod: string;
}

export interface BookingHomeRequestParams {
  page: number;
  limit: number;
  order: string;
  key: string;
  fromDate: Date;
  toDate: Date;
  status: string;
}
