import { useEffect, useState } from "react";
import ModalProps, { closeModal, openModal } from "../components/ModalProps";
import {  UserApi } from "../middleware/restApi.service";
import { FaPenClip } from "react-icons/fa6";
import { FaKey, FaTrash } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { getAllKategoryUser } from "../middleware/global.service";

const schema = Yup.object({
  name: Yup.string().required("Nama wajib diisi"),
  email: Yup.string().required("email wajib diisi"),
  password: Yup.string().required("password wajib diisi"),
  role: Yup.string().required("role wajib diisi"),
  id: Yup.string(),
  KategoriId: Yup.string(),
});

const ManageUser = () => {
  const [users, setUsers] = useState<any>([]);
  const [kategori, setKategori] = useState<any>([]);
  const [dataUsers, setDataUsers] = useState<any>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUsers();
    getKategoriUser()
  }, []);

  const getUsers = async () => {
    const { data } = await UserApi.GetUsers();
    setUsers(data?.data);
  };
  const getKategoriUser = async () => {
    const { data } = await getAllKategoryUser();
    setKategori(data);
  };

  const getUsersById = async (id: string) => {
    const { data } = await UserApi.GetUserById(Number(id));
    const dataUser = data.data;
    setDataUsers(dataUser)
    
  };
 
  
  const HandleEdit = async () => {
    try {
      const data = {
        name: dataUsers.name,
        email: dataUsers.email,
        roleId: Number(dataUsers.roleId),
        kategoriUserId:Number(dataUsers.kategoriUserId)
      }
      await UserApi.EditUser(Number(dataUsers.id), data);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: false,
        timer: 1500,
      });
      getUsers()
      closeModal('edit-user')
    } catch (error) {
      console.log(error);
      
    }
  }

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "",
      id: "",
      kategoriId: ""
    },
    validationSchema: schema,
    onSubmit: async (values) => {
    
      try {
        setLoading(true);
        const dataProps = {
          name: values.name,
          email: values.email,
          password: values.password,
          confPassword: values.password,
          role: Number(values.role),
          kategoriUserId: Number(values.kategoriId)
        };

        await UserApi.CreateUSer(dataProps);
        closeModal("add-user");
        getUsers();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 1500,
        });
        formik.resetForm()
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.";
        closeModal("add-user");
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

  const resetPassword = async (id: string | number | null) => {
    try {
      const idUser = Number(id);
      const dataProps = {
        password: "12345678",
      }
      const res = await UserApi.ResetPassword(idUser, dataProps);
      if (res) {
        Swal.fire({
          title: "Success!",
          text: "Password telah di reset",
          icon: "success",
        });
      }
      
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Gagal mereset password silakan coba beberapa saat lagi",
      });
      console.log(error);
    }
  };

  const trigerReset = (id: string | number | null) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Password akan di reset ke 12345678",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Reset Password!",
    }).then((result) => {
      if (result.isConfirmed) {
        resetPassword(id);
      }
    });
  };

  const deleteUser = async (id: string | number | null) => {
    try {
      const idExpense = Number(id);
      const res = await UserApi.DeleteUser(idExpense);
      if (res) {
        Swal.fire({
          title: "Deleted!",
          text: "Your data has been deleted.",
          icon: "success",
        });
      }
      getUsers();
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
        deleteUser(id);
      }
    });
  };

  return (
    <div className="p-5 w-full">
      <span className="text-3xl font-bold">Kelola User</span>
      <div className="divider divider-warning"></div>
      <div className="flex gap-2 justify-end items-end">
        <button
          className="btn btn-ghost bg-green-500 text-white hover:bg-green-400"
          onClick={() => openModal("add-user")}
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
                <th>Email</th>
                <th>Role</th>
                <th>Kategori</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((item: any, index: number) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item?.name}</td>
                  <td>{item?.email}</td>
                  <td>{item?.role.name}</td>
                  <td>{item?.kategoriUser?.name ?? '-'}</td>
                  <td>
                    <div className="w-full flex gap-1">
                      <button
                        className="btn btn-sm bg-orange-500 text-white font-bold tooltip"
                        data-tip="Edit"
                        onClick={() => {
                          openModal("edit-user"),
                            // setEdit(true),
                            getUsersById(item.id)
                            // setName(item.name);
                        }}
                      >
                        <FaPenClip />
                      </button>
                      <button
                        className="btn btn-sm bg-blue-500 text-white font-bold tooltip"
                        data-tip="Reset Password"
                        onClick={() => trigerReset(item.id)}
                      >
                        <FaKey />
                      </button>
                      <button
                        className="btn btn-sm bg-red-500 text-white font-bold tooltip"
                        data-tip="Delete"
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

      <ModalProps id="add-user">
        <div className="w-full flex flex-col items-center">
          <span className="text-xl font-bold">Tambah Data</span>
          <form
            className="w-full flex flex-col gap-2 py-3"
            onSubmit={formik.handleSubmit}
          >
            <div className="w-full">
              <label>Nama</label>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
                onChange={formik.handleChange}
                value={formik.values.name}
                name="name"
              />
              {formik.errors.name && formik.touched.name ? (
                <div className="w-5/6 text-red-500">{formik.errors.name}</div>
              ) : null}
            </div>
            <div className="w-full">
              <label>Email</label>
              <input
                type="email"
                placeholder="Type here"
                className="input input-bordered w-full"
                onChange={formik.handleChange}
                value={formik.values.email}
                name="email"
              />
              {formik.errors.email && formik.touched.email ? (
                <div className="w-5/6 text-red-500">{formik.errors.email}</div>
              ) : null}
            </div>
            <div className="w-full">
              <label>Password</label>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
                onChange={formik.handleChange}
                value={formik.values.password}
                name="password"
              />
              {formik.errors.password && formik.touched.password ? (
                <div className="w-5/6 text-red-500">{formik.errors.password}</div>
              ) : null}
            </div>

            <div className="w-full">
              <label>Role</label>
              <select
                id="role"
                name="role"
                className="select select-bordered w-full"
                value={Number(formik.values.role)}
                onChange={(e) =>
                  formik.setFieldValue("role", Number(e.target.value))
                }
                onBlur={formik.handleBlur}
              >
                <option value={""}>Select Role</option>
                <option value={"1"}>Bendahara</option>
                <option value={"2"}>Kasir</option>
              </select>
              {formik.errors.role && formik.touched.role ? (
                <div className="w-5/6 text-red-500">{formik.errors.role}</div>
              ) : null}
            </div>
            <div className="w-full">
              <label>Kategori User</label>
              <select
                id="kategoriId"
                name="kategoriId"
                className="select select-bordered w-full"
                value={Number(formik.values.kategoriId)}
                onChange={(e) =>
                  formik.setFieldValue("kategoriId", Number(e.target.value))
                }
                onBlur={formik.handleBlur}
              >
                <option value={""}>Select Kategori</option>
                {
                  kategori.map((item: any, index: number) => (

                    <option value={item.id} key={index}>{item.name}</option>
                  ))
                }
               
              </select>
              {formik.errors.kategoriId && formik.touched.kategoriId ? (
                <div className="w-5/6 text-red-500">{formik.errors.kategoriId}</div>
              ) : null}
            </div>
            <button
              className="btn btn-ghost bg-green-500 text-white w-full mt-5"
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

      <ModalProps id="edit-user">
        <div className="w-full flex flex-col items-center">
          <span className="text-xl font-bold">Edit Data</span>
          <div
            className="w-full flex flex-col gap-2 py-3"
           
          >
            <div className="w-full">
              <label>Nama</label>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
                onChange={(e) => setDataUsers({
                  id: dataUsers.id,
                  name: e.target.value,
                  email: dataUsers.email,
                  roleId: dataUsers.roleId,
                  kategoriUserId: dataUsers.kategoriUserId,
                })}
                value={dataUsers?.name}
                name="name"
              />
             
            </div>
            <div className="w-full">
              <label>Email</label>
              <input
                type="email"
                placeholder="Type here"
                className="input input-bordered w-full"
                onChange={(e) => setDataUsers({
                  id: dataUsers.id,
                  name: dataUsers.name,
                  email: e.target.value,
                  roleId: dataUsers.roleId,
                  kategoriUserId: dataUsers.kategoriUserId,
                })}
                value={dataUsers?.email}
                name="email"
              />
             
            </div>
           

            <div className="w-full">
              <label>Role</label>
              <select
                id="role"
                name="role"
                className="select select-bordered w-full"
                value={dataUsers?.roleId}
                onChange={(e) => setDataUsers({
                  id: dataUsers.id,
                  name: dataUsers.name,
                  email: dataUsers.email,
                  roleId: e.target.value,
                  kategoriUserId: dataUsers.kategoriUserId,
                })}
              >
                <option value={""}>Select Role</option>
                <option value={"1"}>Bendahara</option>
                <option value={"2"}>Kasir</option>
              </select>
              
            </div>
            <div className="w-full">
              <label>Kategori User</label>
              <select
                id="kategoriId"
                name="kategoriId"
                className="select select-bordered w-full"
                value={dataUsers?.kategoriUserId}
                onChange={(e) => setDataUsers({
                  id: dataUsers.id,
                  name: dataUsers.name,
                  email: dataUsers.email,
                  roleId: dataUsers.roleId,
                  kategoriUserId: e.target.value,
                })}
                onBlur={formik.handleBlur}
              >
                <option value={""}>Select Kategori</option>
                {
                  kategori.map((item: any, index: number) => (

                    <option value={item.id} key={index}>{item.name}</option>
                  ))
                }
               
              </select>
             
            </div>
            <button
              className="btn btn-ghost bg-green-500 text-white w-full"
              
              onClick={HandleEdit}
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-infinity loading-lg"></span>
              ) : (
                "Simpan"
              )}
            </button>
          </div>
        </div>
      </ModalProps>
    </div>
  );
};

export default ManageUser;
