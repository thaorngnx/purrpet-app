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
