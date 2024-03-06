export interface BookingSpa {
  purrPetCode: string;
  petName: string;
  spaCode: string;
  bookingSpaPrice: number;
  customerCode: string;
  customerNote: string;
  bookingDate: Date;
  bookingTime: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingSpaResponse {
  error: number;
  message: string;
  data: BookingSpa[];
  totalPage: number;
}
