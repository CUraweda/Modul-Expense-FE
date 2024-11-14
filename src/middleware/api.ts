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
    GetExpense : () => 
        instance({
            method: "GET",
            url: `/expense`
        })
}

export { Auth , ExpenseApi};
