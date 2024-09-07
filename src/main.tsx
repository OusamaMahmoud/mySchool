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
import Fees from "./components/main/Fees";
import TargetFee from "./components/main/TargetFee";
import Accounts from "./components/main/Accounts";
import EducationalStages from "./components/main/EducationalStages";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <Layout />
      </AuthProvider>
    ),
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
      { path: "/fees", element: <Fees /> },
      { path: "/fees/:id", element: <TargetFee /> },
      { path: "/accounts", element: <Accounts /> },
      { path: "/eduStages", element: <EducationalStages /> },
    ],
  },
]);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
