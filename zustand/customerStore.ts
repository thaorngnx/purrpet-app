import {
  getCustomerByCode,
  getCustomerById,
  createCustomer,
  updateCustomer,
  Customer,
} from '../api/customer';

import { verifyOTP } from '../api/otp';
import { logout } from '../api/auth';
import { create } from 'zustand';

type CustomerState = {
  loading: boolean;
  error: string;
  data: Customer;
};

type CustomerStore = {
  customerState: CustomerState;
  setCustomer: (customer: Customer) => void;
  getCustomerById: (id: string) => void;
  getCustomerByCode: (code: string) => void;
  createCustomer: (body: any) => void;
  updateCustomer: (body: any) => void;
  verifyOTP: (body: any) => void;
  logout: () => void;
};

export const useCustomerStore = create<CustomerStore>((set, get) => ({
  customerState: {
    loading: false,
    error: '',
    data: {} as Customer,
  },
  setCustomer: (customer: Customer) => {
    set({
      customerState: {
        ...get().customerState,
        data: customer,
      },
    });
  },
  getCustomerById: async (id: string) => {
    set({
      customerState: {
        ...get().customerState,
        loading: true,
      },
    });
    try {
      const res = await getCustomerById();
      if (res.err === 0) {
        set({
          customerState: {
            loading: false,
            error: '',
            data: res.data,
          },
        });
      } else {
        set({
          customerState: {
            loading: false,
            error: res.msg,
            data: {} as Customer,
          },
        });
      }
    } catch (error: any) {
      set({
        customerState: {
          loading: false,
          error: error.msg,
          data: {} as Customer,
        },
      });
    }
  },
  getCustomerByCode: async (code: string) => {
    set({
      customerState: {
        ...get().customerState,
        loading: true,
      },
    });
    try {
      const res = await getCustomerByCode(code);
      if (res.err === 0) {
        set({
          customerState: {
            loading: false,
            error: '',
            data: res.data,
          },
        });
      } else {
        set({
          customerState: {
            loading: false,
            error: res.msg,
            data: {} as Customer,
          },
        });
      }
    } catch (error: any) {
      set({
        customerState: {
          loading: false,
          error: error.msg,
          data: {} as Customer,
        },
      });
    }
  },
  createCustomer: async (body: any) => {
    set({
      customerState: {
        ...get().customerState,
        loading: true,
      },
    });
    try {
      const res = await createCustomer(body);
      if (res.err === 0) {
        set({
          customerState: {
            loading: false,
            error: '',
            data: res.data,
          },
        });
      } else {
        set({
          customerState: {
            loading: false,
            error: res.msg,
            data: {} as Customer,
          },
        });
      }
    } catch (error: any) {
      set({
        customerState: {
          loading: false,
          error: error.msg,
          data: {} as Customer,
        },
      });
    }
  },
  updateCustomer: async (body: any) => {
    set({
      customerState: {
        ...get().customerState,
        loading: true,
      },
    });
    try {
      const res = await updateCustomer(body);
      if (res.err === 0) {
        set({
          customerState: {
            loading: false,
            error: '',
            data: res.data,
          },
        });
      } else {
        set({
          customerState: {
            loading: false,
            error: res.msg,
            data: {} as Customer,
          },
        });
      }
    } catch (error: any) {
      set({
        customerState: {
          loading: false,
          error: error.msg,
          data: {} as Customer,
        },
      });
    }
  },
  verifyOTP: async (body: any) => {
    set({
      customerState: {
        ...get().customerState,
        loading: true,
      },
    });
    try {
      const res = await verifyOTP(body);
      if (res.err === 0) {
        set({
          customerState: {
            loading: false,
            error: '',
            data: res.data,
          },
        });
      } else {
        set({
          customerState: {
            loading: false,
            error: res.msg,
            data: {} as Customer,
          },
        });
      }
    } catch (error: any) {
      set({
        customerState: {
          loading: false,
          error: error.msg,
          data: {} as Customer,
        },
      });
    }
  },
  logout: async () => {
    set({
      customerState: {
        ...get().customerState,
        loading: true,
      },
    });
    try {
      await logout();
      set({
        customerState: {
          loading: false,
          error: '',
          data: {} as Customer,
        },
      });
    } catch (error: any) {
      set({
        customerState: {
          loading: false,
          error: error.msg,
          data: {} as Customer,
        },
      });
    }
  },
}));
