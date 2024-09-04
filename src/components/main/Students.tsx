import { CgAdd } from "react-icons/cg";
import useStudents from "../../hooks/useStudents";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiClient } from "../../services/api-client";
import useGrades from "../../hooks/useGrades";
import useStudent from "../../hooks/useStudent";
import { toast } from "react-toastify";

const Students = () => {
  const { students, setStudents } = useStudents();
  const { grades } = useGrades();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [targetStuId, setTargetStuId] = useState(0);
  const { student, setStudent } = useStudent({ id: targetStuId });

  const closeModal = () => {
    const modal = document.getElementById(
      "my_modal_1"
    ) as HTMLDialogElement | null;
    modal?.close();
  };

  const openModal = () => {
    const modal = document.getElementById(
      "my_modal_1"
    ) as HTMLDialogElement | null;
    modal?.showModal();
  };

  const handleStudentEditing = async (id: number) => {
    const formData = new FormData();

    if (student) {
      formData.append("id", id.toString());
      formData.append("name", student?.name);
      formData.append("dateOfBirth", student?.dateOfBirth);
      formData.append("gradeId", student?.gradeId.toString());
    }

    try {
      setIsLoading(true);
      await apiClient.put(`Students/${id}`, formData, {
        headers: {
          "Content-Type": "application/json", // Set the correct content type
        },
      });
      setIsLoading(false);
      closeModal();
    } catch (error: any) {
      console.log("edit =>", error);
      setIsLoading(false);
      setError(error.message);
    }
  };

  const handleStudentDelete = async (id: number) => {
    try {
      setIsLoading(true);
      await apiClient.delete(`Students/${id}`);
      setIsLoading(false);
      toast.success("Deleted successfully!", {
        position: "top-right", // Position the toast on the top-right
      });
      setStudents(students.filter((student) => student.id !== id));
    } catch (error: any) {
      console.log("delete =>", error);
      setIsLoading(false);
      setError(error.message);
    }
  };
  const navigate = useNavigate();
  return (
    <div className="overflow-x-auto mt-10">
      <div className="flex justify-end">
        <Link to={"add-new-student"}>
          <button className="flex gap-1 items-center justify-center btn btn-primary mb-8">
            <CgAdd className="text-xl mr-1" />
            Add New Student
          </button>
        </Link>
      </div>
      <table className="table w-full">
        <thead>
          <tr className="bg-[#EAECF0] font-heading">
            <th className="text-left p-2">ID</th>
            <th className="text-left">Student Name</th>
            <th className="text-left  ">Date of birth</th>
            <th className="text-left  ">Grade Id</th>
            <th className="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students?.map((stu) => (
            <tr
              key={stu?.id}
              className="hover:bg-gray-100 transition-all duration-200 cursor-pointer"
              onClick={() => navigate(`/studentDetails/${stu.id}`)}
            >
              <td className="p-2">{stu?.id}</td>
              <td className="text-xl font-bold font-heading capitalize">{stu?.name}</td>
              <td className="">{stu.dateOfBirth}</td>
              <td className="">{stu.gradeId}</td>
              <td>
                <dialog
                  id="my_modal_1"
                  className="modal"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <div className="modal-box">
                    <h3 className="font-bold text-lg">Edit Student Data</h3>
                    <div className="label">
                      <p className="label-text">Student Name</p>
                      <input
                        type="text"
                        className="input input-bordered"
                        onChange={(e) =>
                          setStudent({
                            ...student,
                            name: e.currentTarget.value,
                          })
                        }
                        value={student?.name}
                      />
                    </div>
                    <div className="label">
                      <p className="label-text">Student Date Of Birth</p>
                      <input
                        type="date"
                        className="input input-bordered"
                        onChange={(e) => {
                          const date = e.currentTarget.value; // Capture the date from the input
                          const now = new Date();
                          const timePart = now.toTimeString().split(" ")[0]; // Get the current time part
                          const msPart = now
                            .getMilliseconds()
                            .toString()
                            .padStart(3, "0"); // Get milliseconds and ensure it's 3 digits

                          const formattedDate = `${date}T${timePart}.${msPart}`;

                          setStudent({
                            ...student,
                            dateOfBirth: formattedDate,
                          });
                        }}
                        value={student?.dateOfBirth?.split("T")[0]} // Display only the date part in the
                      />
                    </div>
                    <div className="label">
                      <p className="label-text">Student Grade</p>
                      <select
                        className="select select-bordered"
                        onChange={(e) =>
                          setStudent({
                            ...student,
                            gradeId: Number(e.currentTarget.value),
                          })
                        }
                        value={student?.gradeId}
                      >
                        <option value={""}>Select Student Grade</option>
                        {grades.map((grade) => (
                          <option key={grade.id} value={grade?.id}>
                            {grade.gradeName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const modal = document.getElementById(
                          "my_modal_1"
                        ) as HTMLDialogElement | null;
                        modal?.close();
                      }}
                      className="btn mr-3"
                    >
                      Close
                    </button>
                    <button
                      className={`btn btn-accent  ${
                        isLoading ? "animate-ping" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStudentEditing(stu.id);
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </dialog>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const modal = document.getElementById(
                      "my_modal_1"
                    ) as HTMLDialogElement | null;
                    modal?.showModal();
                    setTargetStuId(stu.id);
                    console.log("hey", stu.id);
                  }}
                  className={`btn btn-sm ml-2  ${
                    isLoading ? "animate-ping" : ""
                  } `}
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStudentDelete(stu.id);
                  }}
                  className={`btn btn-sm btn-warning ml-2`}
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Students;
