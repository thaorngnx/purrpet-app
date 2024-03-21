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
  error: number;
  message: string;
  data: BookingHome[];
  totalPage: number;
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
