import { useEffect, useState } from "react";
import ModalProps, { closeModal, openModal } from "../components/ModalProps";
import {  KategoriUser } from "../middleware/restApi.service";
import { FaTrash } from "react-icons/fa";
import { FaPenClip } from "react-icons/fa6";
import {  getAllKategoryUser } from "../middleware/global.service";
import Swal from "sweetalert2";

const ManageKategoriUser = () => {
  const [dataKategori, setDataKategori] = useState<any[]>([]);
  const [name, setName] = useState<string>("");
  const [idKategori, setIdKatgeori] = useState<string>("");
  const [isEdit, setEdit] = useState(false);

  useEffect(() => {
    getKategory();
  }, []);

  const getKategory = async () => {
    const {data} = await getAllKategoryUser();
    setDataKategori(data);
  };

  const createKategori = async () => {
    try {
      const data = {
        name: name,
      }
      await KategoriUser.CreateKategori(data);
      closeModal("add-kategori");

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: false,
        timer: 1500,
      });
      getKategory();
      setName("");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.";
      closeModal("add-kategori");
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: errorMessage,
      });
    }
  };

  const deleteKategori = async (id: string | number | null) => {
    try {
      const idExpense = Number(id);
      const res = await KategoriUser.Delete(idExpense);
      if (res) {
        Swal.fire({
          title: "Deleted!",
          text: "Your data has been deleted.",
          icon: "success",
        });
      }
      getKategory();
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
        deleteKategori(id);
      }
    });
  };

  const editKategory = async () => {
    try {
      await KategoriUser.Edit(Number(idKategori), { name });
      closeModal("add-kategori");

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: false,
        timer: 1500,
      });
      getKategory();
      setName("");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.";
      closeModal("add-kategori");
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: errorMessage,
      });
    }
  };

  return (
    <div className="p-5 w-full">
      <span className="text-3xl font-bold">Manage Kategori User</span>
      <div className="divider divider-warning"></div>
      <div className="flex gap-2 justify-end items-end">
        <button
          className="btn btn-ghost bg-green-500 text-white hover:bg-green-400"
          onClick={() => {
            openModal("add-kategori"), setEdit(false);
          }}
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {dataKategori.map((item: any, index: number) => (
                <tr>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>
                    <div className="w-full flex gap-1">
                      <button
                        className="btn btn-sm bg-orange-500 text-white font-bold "
                        onClick={() => {
                          openModal("add-kategori"),
                            setEdit(true),
                            setIdKatgeori(item.id),
                            setName(item.name);
                        }}
                      >
                        <FaPenClip />
                      </button>
                      <button
                        className="btn btn-sm bg-red-500 text-white font-bold "
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

      <ModalProps id="add-kategori">
        <div className="w-full flex flex-col items-center">
          <span className="text-xl font-bold">
            {isEdit ? "Edit " : "Tambah "}Data
          </span>
          <div className="w-full flex flex-col gap-2 py-3">
            <div className="w-full">
              <label>Kategori</label>
              <input
                type="text"
                placeholder="Type here"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>
          </div>
          <button
            className="btn btn-ghost bg-green-500 text-white w-full"
            onClick={() => {
              isEdit ? editKategory() : createKategori();
            }}
          >
            Simpan
          </button>
        </div>
      </ModalProps>
    </div>
  );
};

export default ManageKategoriUser;
