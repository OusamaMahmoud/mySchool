import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Dashboard, Students, Teachers, Layout } from "./components/main";
import StudentDetails from "./components/main/StudentDetails";
import Login from "./components/main/Login";
import Grades from "./components/main/Grades";
import { AuthProvider } from "./contexts/AuthContext";
import AddStudent from "./components/sub/AddStudent";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      {
        path: "students",
        element: <Students />,
      },
      { path: "teachers", element: <Teachers /> },
      { path: "students/add-new-student", element: <AddStudent /> },
      { path: "/studentDetails/:id", element: <StudentDetails /> },
      { path: "/login", element: <Login /> },
      { path: "/grades", element: <Grades /> },
    ],
  },
]);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
