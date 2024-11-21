import { useEffect, useState } from "react";
import ModalProps, { closeModal, openModal } from "../components/ModalProps";
import { UserApi } from "../middleware/restApi.service";
import { FaPenClip } from "react-icons/fa6";
import { FaKey, FaTrash } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

const schema = Yup.object({
  name: Yup.string().required("Nama wajib diisi"),
  email: Yup.string().required("email wajib diisi"),
  password: Yup.string().required("password wajib diisi"),
  role: Yup.string().required("role wajib diisi"),
});

const ManageUser = () => {
  const [users, setUsers] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    const { data } = await UserApi.GetUsers();
    setUsers(data?.data);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      console.log("ini jalan");

      try {
        setLoading(true);
        const dataProps = {
          name: values.name,
          email: values.email,
          password: values.password,
          confPassword: values.password,
          role: Number(values.role),
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
                  <td>
                    <div className="w-full flex gap-1">
                      <button
                        className="btn btn-sm bg-orange-500 text-white font-bold "
                        // onClick={() => {
                        //   openModal("add-kategori"),
                        //     setEdit(true),
                        //     setIdKatgeori(item.id),
                        //     setName(item.name);
                        // }}
                      >
                        <FaPenClip />
                      </button>
                      <button
                        className="btn btn-sm bg-blue-500 text-white font-bold "
                        // onClick={() => {
                        //   openModal("add-kategori"),
                        //     setEdit(true),
                        //     setIdKatgeori(item.id),
                        //     setName(item.name);
                        // }}
                      >
                        <FaKey />
                      </button>
                      <button
                        className="btn btn-sm bg-red-500 text-white font-bold "
                        // onClick={() => trigerDelete(item.id)}
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
            <button
              className="btn btn-ghost bg-green-500 text-white w-full"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-infinity loading-lg"></span>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </ModalProps>
    </div>
  );
};

export default ManageUser;
