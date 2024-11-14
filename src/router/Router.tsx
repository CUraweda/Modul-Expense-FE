import { lazy, Suspense, ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import Loading from "../components/Loading";
import ManageUser from "../pages/ManageUser";
import ManageKategori from "../pages/ManageKategori";

const Login = lazy(() => import("../pages/Login"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Expense = lazy(() => import("../pages/Expense"));

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: number[];
}
const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  // const { token, role } = LoginStore();
  const token = "asdasd";
  const role = 1;

  if (!token) {
    return <Navigate to="/" />;
  }

  const roleId = Number(role);

  if (!allowedRoles.includes(roleId)) {
    if (roleId === 1) {
      return <Navigate to="/admin/dashboard" />;
    } else if (roleId === 2) {
      return <Navigate to="/petugas/data" />;
    } else {
      return <Navigate to="/" />;
    }
  }

  return <>{children}</>;
};

const BaseRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<Loading />}>
              <Login />
            </Suspense>
          }
        />
         <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <Suspense fallback={<Loading />}>
                <Layout>
                  <Dashboard/>
                </Layout>
              </Suspense>
            </ProtectedRoute>
          }
        />
         <Route
          path="/admin/expense"
          element={
            <ProtectedRoute allowedRoles={[1, 2]}>
              <Suspense fallback={<Loading />}>
                <Layout>
                  <Expense/>
                </Layout>
              </Suspense>
            </ProtectedRoute>
          }
        />
         <Route
          path="/admin/manage-user"
          element={
            <ProtectedRoute allowedRoles={[1, 2]}>
              <Suspense fallback={<Loading />}>
                <Layout>
                  <ManageUser/>
                </Layout>
              </Suspense>
            </ProtectedRoute>
          }
        />
         <Route
          path="/admin/manage-kategori"
          element={
            <ProtectedRoute allowedRoles={[1, 2]}>
              <Suspense fallback={<Loading />}>
                <Layout>
                  <ManageKategori/>
                </Layout>
              </Suspense>
            </ProtectedRoute>
          }
        />
      </Routes>

    </BrowserRouter>
  );
};

export default BaseRouter;
