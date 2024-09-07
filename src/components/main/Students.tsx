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

    try {
      setIsLoading(true);
      await apiClient.put(`Students/${id}`, student, {
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
            <th className="text-left">Parent Name</th>
            <th className="text-left">Phone Number</th>
            <th className="text-left">Address</th>
            <th className="text-left  ">Date of birth</th>
            <th className="text-left  ">Fees</th>
            <th className="text-left  ">Installments</th>
            <th className="text-left  ">Amount Per Installment</th>
            <th className="text-left  ">Grade </th>
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
              <td className="text-lg font-bold font-heading capitalize">
                {stu?.name}
              </td>
              <td className="capitalize">{stu?.parentsName}</td>
              <td className="">{stu?.phoneNumber}</td>
              <td className="">{stu?.address}</td>
              <td className="">{stu?.dateOfBirth}</td>
              <td className="">{stu?.fee?.totalAmount}</td>
              <td className="">{stu?.fee?.numberOfInstallments}</td>
              <td className="">{stu?.fee?.amountPerInstallment}</td>
              <td className="">
                {grades?.find((g) => g.id === Number(stu.gradeId))?.gradeName}
              </td>
              <td className="flex flex-col gap-2 md:flex-row md:gap-0">
                <dialog
                  id="my_modal_1"
                  className="modal"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <div className="modal-box">
                    <h3 className="font-bold text-lg">Edit Student Data</h3>
                    <div className="flex flex-wrap items-center max-w-3xl mx-auto  gap-x-8 gap-y-5 mt-8 mb-8">
                      <div className="flex flex-col gap-2 ">
                        <h1 className="font-bold">Student Name</h1>
                        <input
                          type="text"
                          className="input input-bordered min-w-80"
                          value={student?.name}
                          onChange={(e) =>
                            setStudent({
                              ...student,
                              name: e.currentTarget.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex flex-col gap-2 ">
                        <h1 className="font-bold">Parent Name</h1>
                        <input
                          type="text"
                          className="input input-bordered min-w-80"
                          value={student?.parentsName}
                          onChange={(e) =>
                            setStudent({
                              ...student,
                              parentsName: e.currentTarget.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex flex-col gap-2 ">
                        <h1 className="font-bold">Address</h1>
                        <input
                          type="text"
                          className="input input-bordered min-w-80"
                          value={student?.address}
                          onChange={(e) =>
                            setStudent({
                              ...student,
                              address: e.currentTarget.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex flex-col gap-2 ">
                        <h1 className="font-bold">Phone Number</h1>
                        <input
                          type="text"
                          className="input input-bordered min-w-80"
                          value={student?.phoneNumber}
                          onChange={(e) =>
                            setStudent({
                              ...student,
                              phoneNumber: e.currentTarget.value,
                            })
                          }
                        />
                      </div>
                      <div className=" flex flex-col gap-2">
                        <h1 className="font-bold">Date Of Birth</h1>
                        <input
                          type="date"
                          className="input input-bordered  min-w-80"
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
                      <div className="flex flex-col gap-2">
                        <h1 className="font-bold ">Student Grade</h1>
                        <select
                          className="select select-bordered min-w-80"
                          onChange={(e) =>
                            setStudent({
                              ...student,
                              gradeId: e.currentTarget.value,
                            })
                          }
                          value={student?.gradeId}
                        >
                          <option value={""}>Select Student Grade</option>
                          {grades?.map((grade) => (
                            <option key={grade.id} value={grade?.id}>
                              {grade?.gradeName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-col gap-2 ">
                        <h1 className="font-bold">Total Amount</h1>
                        <input
                          type="text"
                          className="input input-bordered min-w-80"
                          value={student?.fee?.totalAmount}
                          onChange={(e) =>
                            setStudent({
                              ...student,
                              fee: {
                                ...student.fee,
                                totalAmount: e.currentTarget.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="flex flex-col gap-2 ">
                        <h1 className="font-bold">Number of Installments</h1>
                        <input
                          type="text"
                          className="input input-bordered min-w-80"
                          value={student?.fee?.numberOfInstallments}
                          onChange={(e) =>
                            setStudent({
                              ...student,
                              fee: {
                                ...student.fee,
                                numberOfInstallments: e.currentTarget.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const modal = document.getElementById(
                          "my_modal_1"
                        ) as HTMLDialogElement | null;
                        modal?.close();
                      }}
                      className="btn btn- mr-3"
                    >
                      Close
                    </button>
                    <button
                      className={`btn px-8 btn-accent  ${
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
                   
                  }}
                  className={`btn btn-accent btn-sm px-8 ml-3  ${
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
                  className={`btn btn-sm px-8 btn-warning ml-2`}
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
