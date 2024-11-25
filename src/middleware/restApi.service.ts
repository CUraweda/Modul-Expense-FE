import axios from "axios";
import { token } from "./utils";

const instance = axios.create({
  baseURL: import.meta.env.VITE_REACT_API_URL,
  headers: {
    Authorization: `Bearer ${token.get}`,
  },
});

const Auth = {
  Login: async (email: string | null, password: string | null) =>
    instance({
      method: "POST",
      url: `/auth/login`,
      data: {
        email,
        password,
      },
    }),
};

const ExpenseApi = {
  GetExpense: (startDate?: string, endDate?: string) =>
    instance({
      method: "GET",
      url:
        startDate && endDate ? `/expense/${startDate}/${endDate}` : `/expense`,
    }),
  GetExpenseKasir: (userId: string | null) =>
    instance({
      method: "GET",
      url: `/expense-kasir/${userId}`,
    }),

  CreateExpense: (data: any) =>
    instance({
      method: "POST",
      url: `/expense`,
      data,
    }),
  DeleteExpense: (id: number | string | null) =>
    instance({
      method: "DELETE",
      url: `/expense/${id}`,
    }),
  UpdateStatus: (id: number | string | null, status: any) =>
    instance({
      method: "PATCH",
      url: `/expense/status/${id}`,
      data: status,
    }),
  GetValueDashboard: () =>
    instance({
      method: "GET",
      url: `/expense-summary`,
    }),
};

const KategoriApi = {
  GetKategori: () =>
    instance({
      method: "GET",
      url: `/kategori`,
    }),

  CreateKategori: (data: any) =>
    instance({
      method: "POST",
      url: `/kategori`,
      data,
    }),
  Delete: (id: number | string | null) =>
    instance({
      method: "DELETE",
      url: `/kategori/${id}`,
    }),
  Edit: (id: number | string | null, data: any) =>
    instance({
      method: "PATCH",
      url: `/kategori/${id}`,
      data,
    }),
};

const UserApi = {
  GetUsers: () =>
    instance({
      method: "GET",
      url: `/users`,
    }),
  CreateUSer: (data: any) =>
    instance({
      method: "POST",
      url: `/users`,
      data,
    }),
  GetUserById: (id: number | null) =>
    instance({
      method: "GET",
      url: `/users/${id}`,
    }),
  DeleteUser: (id: number | null) =>
    instance({
      method: "DELETE",
      url: `/users/${id}`,
    }),
  EditUser: (id: number | null, data: any) =>
    instance({
      method: "PATCH",
      url: `/users/${id}`,
      data,
    }),
  ResetPassword: (id: number | null, data: any) =>
    instance({
      method: "PATCH",
      url: `/users-reset-password/${id}`,
      data,
    }),
};

export { Auth, ExpenseApi, KategoriApi, UserApi };
