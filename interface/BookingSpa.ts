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

export interface BookingSpaInfo {
  petName: string;
  spaCode: string;
  bookingSpaPrice: number;
  customerCode: string;
  customerNote: string;
  bookingDate: any;
  bookingTime: string;
  spaName: string;
  size: string;
  petType: string;
}
