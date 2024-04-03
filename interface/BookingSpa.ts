import { Spa } from './spa';

export interface BookingSpa {
  purrPetCode: string;
  petName: string;
  spaCode: string;
  bookingSpaPrice: number;
  customerCode: string;
  customerNote: string;
  bookingDate: Date;
  bookingTime: string;
  totalPayment: number;
  pointUsed: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingSpaDetail {
  purrPetCode?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerNote?: string;
  petName?: string;
  bookingDate?: string;
  bookingTime?: string;
  bookingSpaPrice?: number;
  totalPayment?: number;
  pointUsed?: number;
  status?: string;
  createdAt?: string;
  spa?: Spa;
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
