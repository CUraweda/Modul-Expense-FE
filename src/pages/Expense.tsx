import React, { useEffect, useState } from "react";
import ModalProps, { openModal } from "../components/ModalProps";
import { ExpenseApi } from "../middleware/api";
import { formatMoney, formatDate } from "../utils";
import { FaCheck } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const Expense = () => {
  const [dataList, setDataList] = useState<any[]>([]);

  useEffect(() => {
    getExpense();
  }, []);

  const getExpense = async () => {
    try {
      const { data } = await ExpenseApi.GetExpense();
      setDataList(data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(dataList);

  return (
    <div className="p-5 w-full">
      <span className="text-3xl font-bold">Pengajuan Pengeluaran</span>
      <div className="divider divider-warning"></div>
      <div className="flex gap-2 justify-end items-end">
        <label className="form-control w-md">
          <span className="label-text">Tanggal</span>
          <input
            type="date"
            placeholder="Type here"
            //   value={date}
            className="input input-bordered w-md"
            //   onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <button className="btn btn-ghost bg-yellow-500 text-white hover:bg-yellow-400">
          Eksport Data
        </button>
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
                  <td>{item?.status}</td>
                  <td>{item?.deskripsi}</td>
                  <td>
                    <div className="w-full flex gap2">
                        <button className="btn btn-sm bg-green-500 text-white font-bold"><FaCheck /></button>
                        <button className="btn btn-sm bg-red-500 text-white font-bold "><IoMdClose /></button>
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
          <div className="w-full flex flex-col gap-2 py-3">
            <div className="w-full">
              <label>Keterangan</label>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
              />
            </div>
            <div className="w-full">
              <label>Kategori</label>
              <select className="select select-bordered w-full ">
                <option disabled selected>
                  Who shot first?
                </option>
                <option>Han Solo</option>
                <option>Greedo</option>
              </select>
            </div>

            <div className="w-full">
              <label>Total Biaya</label>
              <input
                type="number"
                placeholder="Type here"
                className="input input-bordered w-full"
              />
            </div>
            <div className="w-full">
              <label>Deskripsi</label>
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Bio"
              ></textarea>
            </div>
          </div>
          <button className="btn btn-ghost bg-green-500 text-white w-full">
            Simpan
          </button>
        </div>
      </ModalProps>
    </div>
  );
};

export default Expense;
