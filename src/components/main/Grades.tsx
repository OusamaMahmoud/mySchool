import { useEffect, useState } from "react";
import { apiClient } from "../../services/api-client";
import { BiEdit } from "react-icons/bi";
import { MdDeleteForever } from "react-icons/md";
import { CgAdd } from "react-icons/cg";
import useEduStages from "../../hooks/useEduStages";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { UserOptions } from "jspdf-autotable";
import { FcNext, FcPrevious } from "react-icons/fc";
import SchoolSkeleton from "../sub/SchoolSkeleton";

// Add this type declaration
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: UserOptions) => jsPDF;
  }
}
export interface Grade {
  id: string;
  gradeName: string;
  educationalStageId: string;
}
const Grades = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [targetGrade, setTargetGrade] = useState<Grade>({} as Grade);
  const [targetGradeId, setTargetGradeId] = useState("");
  const [isLoading] = useState(false);
  const [newGrade, setNewGrade] = useState({
    gradeName: "",
    educationalStageId: "",
  });
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query

  const { educationalStages } = useEduStages();
  const [isFetchGradesLoading, setIsFetchGradesLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1); // Keep track of the current page
  const [pageSize] = useState(8); // Page size can be fixed or dynamic
  const [hasMore, setHasMore] = useState(true); // To know if there are more students to fetch

  // Get A Specific Grade.
  useEffect(() => {
    const getGrade = async () => {
      try {
        const targetGrade = await apiClient.get(`Grades/${targetGradeId}`);
        setTargetGrade(targetGrade.data);
      } catch (error) {
        console.log("fetch Grade error => ", error);
      }
    };
    getGrade();
  }, [targetGradeId]);

  // Get Grades
  useEffect(() => {
    const getGrades = async () => {
      try {
        const res = await apiClient.get(
          `/Grades?searchTerm=${searchQuery}&&pageNumber=${pageNumber}&pageSize=${pageSize}`
        );
        if (res.data.length < pageSize) {
          setHasMore(false); // If the number of students fetched is less than pageSize, there are no more students.
        } else {
          setHasMore(true); // If the number of students fetched is less than pageSize, there are no more students.
        }
        setIsFetchGradesLoading(false);
        setGrades(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
        setIsFetchGradesLoading(false);
      }
    };
    getGrades();
  }, [searchQuery, pageNumber]);

  // Create A Grade
  const handleCreateGrade = async () => {
    if (!newGrade.gradeName) {
      toast.error("Please Provide Student Grade Name.");
      return;
    }
    if (!newGrade.educationalStageId) {
      toast.error("Please Provide Student Educational Stage.");
      return;
    }
    try {
      await apiClient.post("/Grades", newGrade, {
        headers: {
          "Content-Type": "application/json", // Set the correct content type
        },
      });
      toast.success("Successfully Create Grade.");
      setNewGrade({ educationalStageId: "", gradeName: "" });
      const modal = document.getElementById(
        "my_modal_1"
      ) as HTMLDialogElement | null;
      modal?.close();
      const getGrades = async () => {
        try {
          const res = await apiClient.get("/Grades");
          setGrades(res.data);
          console.log(res.data);
        } catch (error) {
          console.log(error);
        }
      };
      getGrades();
    } catch (error) {
      console.log("create grade =>", error);
    }
  };

  // Edit A Grade
  const handleGradeEditing = async () => {
    try {
      const res = await apiClient.put(`/Grades/${targetGradeId}`, targetGrade, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status === 204) {
        // Refetch all grades
        const updatedGrades = await apiClient.get("/Grades");
        setGrades(updatedGrades.data);
      }
      toast.success("Successfully Update the Grade.");
      const modal = document.getElementById(
        "my_modal_2"
      ) as HTMLDialogElement | null;
      modal?.close();
    } catch (error) {
      console.log("Grade errors =>", error);
    }
  };
  // Delete A Grade
  const handleGradeDeleting = async () => {
    try {
      await apiClient.delete(`/Grades/${targetGradeId}`);
      setGrades((prev) => prev.filter((grad) => grad.id !== targetGradeId));
      toast("Grade Successfully Deleted.");
      const modal = document.getElementById(
        "my_modal_3"
      ) as HTMLDialogElement | null;
      modal?.close();
    } catch (error) {
      console.log(error);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Grades List", 20, 10);

    const tableColumn = ["Grade Name", "Educational Stage"];
    const tableRows = grades.map((grad) => [
      grad.gradeName,
      educationalStages?.find((edu) => grad?.educationalStageId === edu?.id)
        ?.name || "N/A",
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("grades_list.pdf");
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      grades.map((grad) => ({
        "Grade Name": grad.gradeName,
        "Educational Stage": educationalStages.find(
          (edu) => grad?.educationalStageId === edu.id
        )?.name,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Grades");
    XLSX.writeFile(workbook, "Grades_list.xlsx");
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
  if(grades.length <= 0) return <SchoolSkeleton />

  return (
    <div className="overflow-x-auto mt-10">
      {/* Add New Grade */}
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg bg-[#091F5B] text-white">
            Add New Grade
          </h3>

          <div className="flex flex-wrap items-center max-w-3xl mx-auto  gap-x-8 gap-y-5 mt-8 mb-8">
            <div className="flex flex-col gap-2 ">
              <h1 className="font-bold">Grade Name</h1>
              <input
                type="text"
                className="input input-bordered min-w-80"
                value={newGrade.gradeName}
                onChange={(e) =>
                  setNewGrade({
                    ...newGrade,
                    gradeName: e.currentTarget.value,
                  })
                }
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center max-w-3xl mx-auto  gap-x-8 gap-y-5 mt-8 mb-8">
            <div className="flex flex-col gap-2 ">
              <h1 className="font-bold">Educational Stage</h1>
              <select
                value={newGrade.educationalStageId}
                onChange={(e) =>
                  setNewGrade({
                    ...newGrade,
                    educationalStageId: e.currentTarget.value,
                  })
                }
                className="select select-bordered min-w-80"
              >
                <option value={""}>Selected Educational Stage</option>
                {educationalStages.map((edu) => (
                  <option value={edu.id} key={edu.id}>
                    {edu.name}
                  </option>
                ))}
              </select>
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
              handleCreateGrade();
            }}
          >
            Add
          </button>
        </div>
      </dialog>

      {/* Edit Grade */}
      <dialog
        id="my_modal_2"
        className="modal"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Edit Grade</h3>
          <div className="flex flex-wrap items-center max-w-3xl mx-auto  gap-x-8 gap-y-5 mt-8 mb-8">
            <div className="flex flex-col gap-2 ">
              <h1 className="font-bold">Grade Name</h1>
              <input
                type="text"
                className="input input-bordered min-w-80"
                onChange={(e) =>
                  setTargetGrade({
                    ...targetGrade,
                    gradeName: e.currentTarget.value,
                  })
                }
                value={targetGrade.gradeName}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center max-w-3xl mx-auto  gap-x-8 gap-y-5 mt-8 mb-8">
            <div className="flex flex-col gap-2 ">
              <h1 className="font-bold">Educational Stage</h1>
              <select
                onChange={(e) =>
                  setTargetGrade({
                    ...targetGrade,
                    educationalStageId: e.currentTarget.value,
                  })
                }
                value={targetGrade.educationalStageId}
                className="select select-bordered min-w-80"
              >
                {educationalStages.map((edu) => (
                  <option value={edu.id} key={edu.id}>
                    {edu.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              const modal = document.getElementById(
                "my_modal_2"
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
              handleGradeEditing();
            }}
          >
            Edit
          </button>
        </div>
      </dialog>

      {/* Delete Grade */}
      <dialog
        id="my_modal_3"
        className="modal"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Delete Grade</h3>
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
            className={`btn px-8 btn-accent`}
            onClick={(e) => {
              e.stopPropagation();
              handleGradeDeleting();
            }}
          >
            Delete
          </button>
        </div>
      </dialog>
      <div>
        <input
          className="input input-bordered"
          placeholder="Searching..."
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
        />
      </div>
      <div className="flex justify-end gap-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            const modal = document.getElementById(
              "my_modal_1"
            ) as HTMLDialogElement | null;
            modal?.showModal();
          }}
          className="flex gap-1 items-center justify-center btn bg-[#091F5B] text-white mb-8"
        >
          <CgAdd className="text-xl mr-1" />
          Add New Grade
        </button>
        <div className="flex gap-4 mb-4">
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
      </div>

      <table className="table w-full">
        <thead>
          <tr className="bg-[#EAECF0] font-heading">
            <th className="text-left">Grade</th>
            <th className="text-left">Educational Stage</th>
            <th className="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {grades?.map((grd) => (
            <tr
              key={grd.id}
              className="hover:bg-gray-100 transition-all duration-200 cursor-pointer"
            >
              <td className="text-lg font-bold font-heading capitalize">
                {grd?.gradeName}
              </td>
              <td className="text-lg font-bold font-heading capitalize">
                {
                  educationalStages.find(
                    (edu) => grd?.educationalStageId === edu.id
                  )?.name
                }
              </td>

              <td className="flex text-lg font-bold font-heading capitalize">
                <BiEdit
                  onClick={(e) => {
                    e.stopPropagation();
                    const modal = document.getElementById(
                      "my_modal_2"
                    ) as HTMLDialogElement | null;
                    modal?.showModal();
                    setTargetGradeId(grd.id);
                  }}
                  className="mr-5 text-2xl hover:text-yellow-300 border "
                />

                <MdDeleteForever
                  onClick={(e) => {
                    e.stopPropagation();
                    const modal = document.getElementById(
                      "my_modal_3"
                    ) as HTMLDialogElement | null;
                    modal?.showModal();
                    setTargetGradeId(grd.id);
                  }}
                  className=" text-2xl hover:text-red-500 "
                />
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

export default Grades;
