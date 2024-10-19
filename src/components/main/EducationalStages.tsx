import { toast } from "react-toastify";
import useEduStages, { EducationalStage } from "../../hooks/useEduStages";
import { apiClient } from "../../services/api-client";
import { useEffect, useState } from "react";
import { CgAdd } from "react-icons/cg";
import { BiEdit } from "react-icons/bi";
import { MdDeleteForever } from "react-icons/md";
import { UserOptions } from "jspdf-autotable";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { FcNext, FcPrevious } from "react-icons/fc";
import SchoolSkeleton from "../sub/SchoolSkeleton";
// Add this type declaration
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: UserOptions) => jsPDF;
  }
}
const EducationalStages = () => {
  const [targetEducationalStage, setEducationalStage] =
    useState<EducationalStage>({} as EducationalStage);
  const [targetEducationalStageId, setTargetEducationalStageId] = useState("");
  const [isLoading] = useState(false);

  const [newEducationalStage, setNewEducationalStage] = useState({
    name: "",
  });

  const {
    educationalStages,
    setEducationalStages,
    setSearchQuery,
    hasMore,
    pageNumber,
    setPageNumber,
  } = useEduStages();

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Educational Stages List", 20, 10);

    const tableColumn = ["Educational Stage Name"];
    const tableRows = educationalStages.map((edu) => [edu.name]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("educational_stages_list.pdf");
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      educationalStages.map((edu) => ({
        "Educational Stage Name": edu.name,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Educational_Stages");
    XLSX.writeFile(workbook, "educational_stages_list.xlsx");
  };

  // Get A Specific Grade.
  useEffect(() => {
    const getGrade = async () => {
      try {
        const targetGrade = await apiClient.get(
          `EducationalStages/${targetEducationalStageId}`
        );
        setEducationalStage(targetGrade.data);
      } catch (error) {
        console.log("fetch Grade error => ", error);
      }
    };
    getGrade();
  }, [targetEducationalStageId]);

  // Create A Grade
  const handleCreateEducationalStage = async () => {
    if (!newEducationalStage.name) {
      toast.error("Please Provide Student Educational Stage.");
      return;
    }
    try {
      await apiClient.post("/EducationalStages", newEducationalStage, {
        headers: {
          "Content-Type": "application/json", // Set the correct content type
        },
      });
      toast.success("Successfully Create Educational Stage.");
      setNewEducationalStage({ name: "" });
      const modal = document.getElementById(
        "my_modal_1"
      ) as HTMLDialogElement | null;
      modal?.close();

      const getEducationalStages = async () => {
        try {
          const res = await apiClient.get("/EducationalStages");
          setEducationalStages(res.data);
          console.log(res.data);
        } catch (error) {
          console.log(error);
        }
      };
      getEducationalStages();
    } catch (error) {
      console.log(error);
    }
  };

  // Edit A Grade
  const handleEducationalStageEditing = async () => {
    try {
      const res = await apiClient.put(
        `/EducationalStages/${targetEducationalStageId}`,
        targetEducationalStage,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status === 204) {
        // Refetch all grades
        const updatedGrades = await apiClient.get("/EducationalStages");
        setEducationalStages(updatedGrades.data);
      }
      toast.success("Successfully Update the Educational Stage.");
      const modal = document.getElementById(
        "my_modal_2"
      ) as HTMLDialogElement | null;
      modal?.close();
    } catch (error) {
      console.log("Educational Stages errors =>", error);
    }
  };
  // Delete A Grade
  const handleEducationalStageDeleting = async () => {
    try {
      await apiClient.delete(`/EducationalStages/${targetEducationalStageId}`);
      setEducationalStages((prev) =>
        prev.filter((grad) => grad.id !== targetEducationalStageId)
      );
      toast("Educational Stage Successfully Deleted.");
      const modal = document.getElementById(
        "my_modal_3"
      ) as HTMLDialogElement | null;
      modal?.close();
    } catch (error) {
      console.log(error);
    }
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

  if(educationalStages.length <= 0) return <SchoolSkeleton />
  
  return (
    <div className="overflow-x-auto mt-10">
      {/* Add New Grade */}
      <dialog
        id="my_modal_1"
        className="modal"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Educational Stage</h3>
          <div className="flex flex-wrap items-center max-w-3xl mx-auto  gap-x-8 gap-y-5 mt-8 mb-8">
            <div className="flex flex-col gap-2 ">
              <h1 className="font-bold">Educational Stage Name</h1>
              <input
                type="text"
                className="input input-bordered min-w-80"
                value={newEducationalStage.name}
                onChange={(e) =>
                  setNewEducationalStage({
                    ...newEducationalStage,
                    name: e.currentTarget.value,
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
              handleCreateEducationalStage();
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
          <h3 className="font-bold text-lg">Edit Educational Stage</h3>
          <div className="flex flex-wrap items-center max-w-3xl mx-auto  gap-x-8 gap-y-5 mt-8 mb-8">
            <div className="flex flex-col gap-2 ">
              <h1 className="font-bold">Grade Name</h1>
              <input
                type="text"
                className="input input-bordered min-w-80"
                onChange={(e) =>
                  setEducationalStage({
                    ...targetEducationalStage,
                    name: e.currentTarget.value,
                  })
                }
                value={targetEducationalStage.name}
              />
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
              handleEducationalStageEditing();
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
              handleEducationalStageDeleting();
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
          Add New Educational Stage
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
            <th className="text-left">Educational Stage</th>
            <th className="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {educationalStages?.map((edu, idx) => (
            <tr
              key={idx}
              className="hover:bg-gray-100 transition-all duration-200 cursor-pointer"
            >
              <td className="text-lg font-bold font-heading capitalize">
                {edu?.name}
              </td>
              <td className="flex text-lg font-bold font-heading capitalize">
                <BiEdit
                  onClick={(e) => {
                    e.stopPropagation();
                    const modal = document.getElementById(
                      "my_modal_2"
                    ) as HTMLDialogElement | null;
                    modal?.showModal();
                    setTargetEducationalStageId(edu.id);
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
                    setTargetEducationalStageId(edu.id);
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

export default EducationalStages;
