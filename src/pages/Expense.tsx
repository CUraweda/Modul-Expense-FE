import { useEffect, useState } from "react";
import ModalProps, { closeModal, openModal } from "../components/ModalProps";
import { ExpenseApi } from "../middleware/restApi.service";
import { formatMoney, formatDate, formatDateLocal } from "../utils";
import { FaCheck, FaTrash } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { Store } from "../store/Store";
import * as XLSX from "xlsx";
import {
  getAllKategory,
  getExpenses,
  updateStatusProps,
} from "../middleware/global.service";

const schema = Yup.object({
  name: Yup.string().required("Nama wajib diisi"),
  kategori: Yup.string().required("Kategori wajib diisi"),
  biaya: Yup.number().required("Biaya wajib diisi"),
  deskripsi: Yup.string().required("Deskripsi wajib diisi"),
});

const Expense = () => {
  const [dataList, setDataList] = useState<any[]>([]);
  const [dataKategori, setDataKategori] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<any>({
    startDate: "",
    endDate: "",
  });
  const { id, role } = Store();

  useEffect(() => {
    getKategory();
    getExpense();
  }, [date]);

  const getExpense = async () => {
    const expenseData = await getExpenses(date.startDate, date.endDate, role, id);
    setDataList(expenseData);
  };

  const getKategory = async () => {
    const kate = await getAllKategory();
    setDataKategori(kate);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      kategori: "",
      biaya: "",
      deskripsi: "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const dataProps = {
          name: values.name,
          date: new Date(),
          kategoriId: values.kategori,
          biaya: values.biaya,
          deskription: values.deskripsi,
          status: "Pending",
          userId: id,
        };

        await ExpenseApi.CreateExpense(dataProps);
        closeModal("add-expense");
        getExpense();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.";
        closeModal("add-expense");
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    },
  });

  const deleteExpense = async (id: string | number | null) => {
    try {
      const idExpense = Number(id);
      const res = await ExpenseApi.DeleteExpense(idExpense);
      if (res) {
        Swal.fire({
          title: "Deleted!",
          text: "Your data has been deleted.",
          icon: "success",
        });
      }
      getExpense();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Gagal menghapus data silakan coba beberapa saat lagi",
      });
      console.log(error);
    }
  };

  const trigerDelete = (id: string | number | null) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteExpense(id);
      }
    });
  };

  const updateStatus = async (id: string | number | null, status: string) => {
    const update = await updateStatusProps(id, status);
    if (update) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: false,
        timer: 1500,
      });
      getExpense();
    } else {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: update,
      });
    }
  };

  const exportToExcel = () => {
    const formattedData = dataList.map((item, index) => ({
      No: index + 1,
      Name: item.name,
      Date: formatDate(item.date),
      Category: item.kategory,
      Cost: item.biaya,
      Status: item.status,
      Description: item.deskripsi,
      User: item.user,
      TimeStamp: formatDate(item.createdAt),
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

    const fileName = `expense-${formatDateLocal(new Date())}`;
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <div className="p-5 w-full">
      <span className="text-3xl font-bold">Pengajuan Pengeluaran</span>
      <div className="divider divider-warning"></div>
      <div className="flex gap-2 justify-end items-end">
        <div
          className={`${
            role == "2" ? "hidden" : ""
          } w-full flex items-end gap-2 justify-end`}
        >
          <label className="form-control w-md">
            <span className="label-text">From</span>
            <input
              type="date"
              placeholder="Type here"
              value={date.startDate}
              className="input input-bordered w-md"
              onChange={(e) =>
                setDate({
                  startDate: e.target.value,
                  endDate: date.endDate ? date.endDate : e.target.value,
                })
              }
            />
          </label>
          <label className="form-control w-md">
            <span className="label-text">To</span>
            <input
              type="date"
              placeholder="Type here"
              value={date.endDate}
              className="input input-bordered w-md"
              onChange={(e) =>
                setDate({ startDate: date.startDate, endDate: e.target.value })
              }
            />
          </label>

          <button
            className="btn btn-ghost bg-yellow-500 text-white hover:bg-yellow-400"
            onClick={exportToExcel}
          >
            Eksport Data
          </button>
        </div>
        <button
          className="btn btn-ghost bg-green-500 text-white hover:bg-green-400"
          onClick={() => openModal("add-expense")}
        >
          Tambah Data
        </button>
      </div>
      <div className="w-full bg-white p-3 rounded-md mt-5">
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            {/* head */}
            <thead>
              <tr className="bg-yellow-400">
                <th>No</th>
                <th>Nama</th>
                <th>Nama User</th>
                <th>Tanggal</th>
                <th>Kategori</th>
                <th>Total Biaya</th>
                <th>Status</th>
                <th>Deskripsi</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {dataList?.map((item: any, index: number) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item?.name}</td>
                  <td>{item?.user}</td>
                  <td>{formatDate(item?.date)}</td>
                  <td>{item?.kategory}</td>
                  <td>{formatMoney(item?.biaya)}</td>
                  <td>
                    <span
                      className={`py-1 px-3 rounded-xl ${
                        item?.status == "Pending"
                          ? "text-yellow-700 bg-yellow-100"
                          : item?.status == "Ditolak"
                          ? "text-red-700 bg-red-100"
                          : "text-green-700 bg-green-100"
                      }`}
                    >
                      {item?.status}
                    </span>
                  </td>
                  <td>{item?.deskripsi}</td>
                  <td>
                    <div
                      className={`w-full flex gap2 ${
                        item?.status == "Disetujui"
                          ? "hidden"
                          : item?.status == "Ditolak"
                          ? "hidden"
                          : ""
                      } `}
                    >
                      <button
                        className={`btn btn-sm bg-green-500 text-white font-bold tooltip ${
                          role == "2" ? "hidden" : ""
                        }`}
                        data-tip="Setujui"
                        onClick={() => updateStatus(item.id, "Disetujui")}
                      >
                        <FaCheck />
                      </button>
                      <button
                        className={`btn btn-sm bg-orange-500 text-white font-bold tooltip${
                          role == "2" ? "hidden" : ""
                        }`}
                        data-tip="Tolak"
                        onClick={() => updateStatus(item.id, "Ditolak")}
                      >
                        <IoMdClose />
                      </button>
                      <button
                        className="btn btn-sm bg-red-500 text-white font-bold tooltip"
                        data-tip="Hapus"
                        onClick={() => trigerDelete(item.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ModalProps id="add-expense">
        <div className="w-full flex flex-col items-center">
          <span className="text-xl font-bold">Tambah Data</span>
          <form
            className="w-full flex flex-col gap-2 py-3"
            onSubmit={formik.handleSubmit}
          >
            <div className="w-full">
              <label>Keterangan</label>
              <input
                type="text"
                placeholder="Input Keterangan"
                className="input input-bordered w-full"
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
              {formik.errors.name && formik.touched.name ? (
                <div className="w-5/6 text-red-500">{formik.errors.name}</div>
              ) : null}
            </div>
            <div className="w-full">
              <label htmlFor="kategori">Kategori</label>
              <select
                id="kategori"
                name="kategori"
                className="select select-bordered w-full"
                value={Number(formik.values.kategori)}
                onChange={(e) =>
                  formik.setFieldValue("kategori", Number(e.target.value))
                }
                onBlur={formik.handleBlur}
              >
                <option value="">Pilih Kategori</option>
                {dataKategori?.map((item: any, index: number) => (
                  <option value={item?.id} key={index}>
                    {item?.name}
                  </option>
                ))}
              </select>
              {formik.errors.kategori && formik.touched.kategori ? (
                <div className="w-5/6 text-red-500">
                  {formik.errors.kategori}
                </div>
              ) : null}
            </div>

            <div className="w-full">
              <label>Total Biaya</label>
              <input
                type="number"
                placeholder="Type here"
                className="input input-bordered w-full"
                name="biaya"
                onChange={formik.handleChange}
                value={formik.values.biaya}
              />
              {formik.errors.biaya && formik.touched.biaya ? (
                <div className="w-5/6 text-red-500">{formik.errors.biaya}</div>
              ) : null}
            </div>
            <div className="w-full">
              <label>Deskripsi</label>
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="deskripsi"
                name="deskripsi"
                onChange={formik.handleChange}
                value={formik.values.deskripsi}
              />
              {formik.errors.deskripsi && formik.touched.deskripsi ? (
                <div className="w-5/6 text-red-500">
                  {formik.errors.deskripsi}
                </div>
              ) : null}
            </div>
            <button
              className="btn btn-ghost bg-green-500 text-white w-full"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-infinity loading-lg"></span>
              ) : (
                "Simpan"
              )}
            </button>
          </form>
        </div>
      </ModalProps>
    </div>
  );
};

export default Expense;
