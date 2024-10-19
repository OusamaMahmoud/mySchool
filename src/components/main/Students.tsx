import { CgAdd } from "react-icons/cg";
import useStudents, { Student } from "../../hooks/useStudents";
import { Link } from "react-router-dom";
import { useState } from "react";
import { apiClient } from "../../services/api-client";
import useGrades from "../../hooks/useGrades";
import useStudent from "../../hooks/useStudent";
import { toast } from "react-toastify";
import { FcNext, FcPrevious } from "react-icons/fc";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { UserOptions } from "jspdf-autotable";

// Add this type declaration
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: UserOptions) => jsPDF;
  }
}

const Students = () => {
  const {
    students,
    setStudents,
    setPageNumber,
    pageNumber,
    hasMore,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    searchQuery,
    setSearchQuery,
    isLoading
  } = useStudents();
  const { grades } = useGrades();
  const [isStuEditingLoading, setIsStuEditingLoading] = useState(false);
  const [isStuDeletingLoading, setIsStuDeletingLoading] = useState(false);
  const [targetStuId, setTargetStuId] = useState(0);
  const { student, setStudent } = useStudent({ id: targetStuId });

  const closeModal = (label: string) => {
    const modal = document.getElementById(
      `${label}`
    ) as HTMLDialogElement | null;
    modal?.close();
  };

  const handleSortDirectionChange = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleNextPage = () => {
    if (hasMore) {
      setPageNumber(pageNumber + 1); // Load the next page
    }
  };

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1); // Go to the previous page
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPageNumber(1); // Reset to the first page when searching
  };

  const validate = () => {
    const {
      address,
      dateOfBirth,
      fee: { numberOfInstallments, totalAmount },
      gradeId,
      name,
      parentsName,
      phoneNumber,
    } = student;
    if (!name) {
      toast.error("Name is Not Found!");
      return false;
    }
    if (!parentsName) {
      toast.error("Parents Name is Not Found!");
      return false;
    }
    if (!phoneNumber) {
      toast.error("Phone Number is Not Found!");
      return false;
    }
    if (!gradeId) {
      toast.error("Grade is Not Found!");
      return false;
    }
    if (!address) {
      toast.error("Address is Not Found!");
      return false;
    }
    if (!dateOfBirth) {
      toast.error("Date Of Birth is Not Found!");
      return false;
    }
    if (!numberOfInstallments) {
      toast.error("Number Of Installments is Not Found!");
      return false;
    }
    if (!totalAmount) {
      toast.error("Total Amount is Not Found!");
      return false;
    }
    return true;
  };

  const handleStudentEditing = async () => {
    if (!validate()) return;
    try {
      setIsStuEditingLoading(true);
      await apiClient.put(`Students/${targetStuId}`, student, {
        headers: {
          "Content-Type": "application/json", // Set the correct content type
        },
      });
      setStudents((prev) =>
        prev.map((stu) => (stu.id === student.id ? student : stu))
      );
      setIsStuEditingLoading(false);
      toast.success("Student Account has been updated successfully.");
      closeModal("my_modal_1");
    } catch (error: any) {
      console.log("edit =>", error);
      setIsStuEditingLoading(false);
      toast.error(error.message);
    }
  };

  const handleStudentDelete = async () => {
    try {
      setIsStuDeletingLoading(true);
      await apiClient.delete(`Students/${targetStuId}`);
      setIsStuDeletingLoading(false);
      toast.success("Deleted successfully!", {
        position: "top-right", // Position the toast on the top-right
      });
      setStudents(students.filter((st) => st.id !== targetStuId));
      closeModal("my_modal_3");
    } catch (error: any) {
      console.log("delete =>", error);
      setIsStuDeletingLoading(false);
      toast.error(error.message);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Students List", 20, 10);

    const tableColumn = [
      "Name",
      "Parent Name",
      "Phone Number",
      "Address",
      "Date of Birth",
      "Grade",
    ];
    const tableRows = students.map((student: Student) => [
      student.name,
      student.parentsName,
      student.phoneNumber,
      student.address,
      student.dateOfBirth.split("T")[0],
      grades?.find((g) => g.id === Number(student.gradeId))?.gradeName || "",
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("students_list.pdf");
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      students.map((student: Student) => ({
        "Student Name": student.name,
        "Parent Name": student.parentsName,
        "Phone Number": student.phoneNumber,
        Address: student.address,
        "Date of Birth": student.dateOfBirth.split("T")[0],
        Grade:
          grades?.find((g) => g.id === Number(student.gradeId))?.gradeName ||
          "",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, "students_list.xlsx");
  };

  return (
    <div className="overflow-x-auto mt-10">
      <div className="flex flex-col gap-4 justify-between  mb-6">
        <div className="flex justify-end gap-2 mb-3">
          <Link to={"add-new-student"}>
            <button className="flex gap-1 items-center justify-center btn bg-[#091F5B] text-white ">
              <CgAdd className="text-xl mr-1" />
              Add New Student
            </button>
          </Link>
          <button onClick={exportToPDF} className="btn bg-[#091F5B] text-white">
            Export to PDF
          </button>
          <button
            onClick={exportToExcel}
            className="btn bg-[#091F5B] text-white"
          >
            Export to Excel
          </button>
        </div>
        <div className="flex items-center gap-10">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="input input-bordered w-full max-w-xs"
          />
          <div className="flex items-center gap-6">
            <label htmlFor="sortBy" className="whitespace-nowrap">
              Sort By:{" "}
            </label>
            <select
              id="sortBy"
              className="select select-bordered"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="Name">Student Name</option>
              <option value="ParentsName">Parent Name</option>
              <option value="PhoneNumber">Phone Number</option>
              <option value="DateOfBirth">Date of Birth</option>
              <option value="TotalAmount">Fees</option>
            </select>

            {/* Sort Direction Toggle */}
            <button
              className="btn bg-[#091F5B] text-white"
              onClick={handleSortDirectionChange}
            >
              {sortDirection === "asc" ? "Ascending" : "Descending"}
            </button>
          </div>
        </div>
      </div>
      <table className="table w-full">
        <thead>
          <tr className="bg-[#EAECF0] font-heading">
            <th className="text-left">Student Name</th>
            <th className="text-left">Parent Name</th>
            <th className="text-left">Phone Number</th>
            <th className="text-left">Address</th>
            <th className="text-left  ">Date of birth</th>
            <th className="text-left  ">Grade </th>
            <th className="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students?.map((stu) => (
            <tr
              key={stu?.id}
              className="hover:bg-gray-100 transition-all duration-200 "
            >
              <td className="text-lg font-bold font-heading capitalize">
                {stu?.name}
              </td>
              <td className="capitalize">{stu?.parentsName}</td>
              <td className="">{stu?.phoneNumber}</td>
              <td className="">{stu?.address}</td>
              <td className="">{stu?.dateOfBirth.split("T")[0]}</td>
              <td className="">
                {grades?.find((g) => g.id === Number(stu.gradeId))?.gradeName}
              </td>
              <td className="flex flex-col mt-2 gap-2 md:flex-row md:gap-0">
                {/* Edit A Student */}
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
                      className={`btn px-8 bg-[#091F5B] text-white  ${
                        isStuEditingLoading ? "animate-ping" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStudentEditing();
                      }}
                    >
                     {isStuEditingLoading? "Editing..." : "Edit"}
                    </button>
                  </div>
                </dialog>

                {/* Delete A Student! */}
                <dialog
                  id="my_modal_3"
                  className="modal"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4">Are You Sure ?</h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const modal = document.getElementById(
                          "my_modal_3"
                        ) as HTMLDialogElement | null;
                        modal?.close();
                      }}
                      className="btn btn- mr-3"
                    >
                      Close
                    </button>
                    <button
                      className={`btn px-8 btn-warning text-white `}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStudentDelete();
                      }}
                    >
                      {isStuDeletingLoading ? "Deleting..." : " Delete"}
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
                  className={`btn bg-[#091F5B] text-white btn-sm px-8 ml-3 `}
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const modal = document.getElementById(
                      "my_modal_3"
                    ) as HTMLDialogElement | null;
                    modal?.showModal();
                    setTargetStuId(stu.id);
                  }}
                  className={`btn btn-sm px-8 btn-warning ml-2`}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end gap-6 mt-4 mb-6 ">
        <button
          className="btn btn-accent text-white"
          onClick={handlePreviousPage}
          disabled={pageNumber === 1}
        >
          <FcPrevious />
          {isLoading && pageNumber === 1 ? "Loading..." : "Previous Page"}
        </button>

        <button
          className="btn btn-accent text-white"
          onClick={handleNextPage}
          disabled={!hasMore}
        >
          {isLoading ? "Loading..." : "Next Page"} <FcNext />
        </button>
      </div>
    </div>
  );
};

export default Students;
