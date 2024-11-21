import { ExpenseApi, KategoriApi } from "./restApi.service";

export const getAllKategory = async () => {
  try {
    const { data } = await KategoriApi.GetKategori();
    return data?.data;
  } catch (error) {
    console.log(error);
  }
};

export const getExpenses = async (startDate: any, endDate: any, role: string | null, id: string | null) => {
  try {
    if (role == "1") {
      const { data } = await ExpenseApi.GetExpense(startDate, endDate);
      return data?.data;
    } else {
      const { data } = await ExpenseApi.GetExpenseKasir(id);
      return data?.data;
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateStatusProps = async (id: string | number | null, status: string) => {
  try {
    const data = {
      status: status,
    };
    await ExpenseApi.UpdateStatus(id, data);
    return true
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred. Please try again.";
    console.log(error);

    return errorMessage
  }
};