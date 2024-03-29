export interface IWard {
  Id: string;
  Name: string;
  find: (ward: IWard) => IWard;
  setWards: (wards: IWard[]) => void;
}

export interface IDistrict {
  Id: string;
  Name: string;
  Wards: IWard[];
}

export interface IProvince {
  Id: string;
  Name: string;
  Districts: IDistrict[];
}

export interface ICustomer {
  purrPetCode: string;
  name: string;
  email: string;
  phoneNumber: string;
  point: number;
  address: {
    province: string;
    district: string;
    ward: string;
    street: string;
  };
}
