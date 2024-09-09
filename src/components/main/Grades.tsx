import { useEffect, useState } from "react";
import { apiClient } from "../../services/api-client";
import { BiEdit } from "react-icons/bi";
import { MdDeleteForever } from "react-icons/md";
import { CgAdd } from "react-icons/cg";
import useEduStages from "../../hooks/useEduStages";
import { toast } from "react-toastify";

interface Grade {
  id: string;
  gradeName: string;
  educationalStageId: string;
}
const Grades = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [targetGrade, setTargetGrade] = useState<Grade>({} as Grade);
  const [targetGradeId, setTargetGradeId] = useState("");
  const [isLoading,] = useState(false);
  // const [error, setError] = useState("");
  const [newGrade, setNewGrade] = useState({
    id: "",
    gradeName: "",
    educationalStageId: "",
  });

  const { educationalStages } = useEduStages();
  useEffect(() => {
    console.log(targetGradeId);
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

  useEffect(() => {
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
  }, []);

  const handleCreateGrade = async () => {
    try {
      await apiClient.post("/Grades", newGrade, {
        headers: {
          "Content-Type": "application/json", // Set the correct content type
        },
      });
      toast.success("Successfully Create Grade.");
      const modal = document.getElementById(
        "my_modal_1"
      ) as HTMLDialogElement | null;
      modal?.close();
    } catch (error) {
      console.log(error);
    }
  };

  const handleGradeEditing = async () => {
    try {
      const res = await apiClient.put(
        `/Grades/${targetGradeId}`,
        { ...newGrade, id: targetGradeId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status === 204) {
        setGrades((prev) =>
          prev.map((g) =>
            g.id === targetGradeId
              ? {
                  ...g,
                  gradeName: newGrade.gradeName,
                  educationalStageId: newGrade.educationalStageId,
                }
              : g
          )
        );
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
          <h3 className="font-bold text-lg">Add New Grade</h3>
          <div className="flex flex-wrap items-center max-w-3xl mx-auto  gap-x-8 gap-y-5 mt-8 mb-8">
            <div className="flex flex-col gap-2 ">
              <h1 className="font-bold">Grade Name</h1>
              <input
                type="text"
                className="input input-bordered min-w-80"
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
                onChange={(e) =>
                  setNewGrade({
                    ...newGrade,
                    educationalStageId: e.currentTarget.value,
                  })
                }
                className="select select-bordered min-w-80"
              >
                {educationalStages.map((edu) => (
                  <option value={edu.id}>{edu.name}</option>
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
                  setNewGrade({
                    ...newGrade,
                    gradeName: e.currentTarget.value,
                  })
                }
                defaultValue={targetGrade.gradeName}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center max-w-3xl mx-auto  gap-x-8 gap-y-5 mt-8 mb-8">
            <div className="flex flex-col gap-2 ">
              <h1 className="font-bold">Educational Stage</h1>
              <select
                onChange={(e) =>
                  setNewGrade({
                    ...newGrade,
                    educationalStageId: e.currentTarget.value,
                  })
                }
                className="select select-bordered min-w-80"
              >
                {educationalStages.map((edu) => (
                  <option
                    value={edu.id}
                    key={edu.id}
                    defaultValue={targetGrade.educationalStageId}
                  >
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
                "my_modal_2"
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

      <div className="flex justify-end">
        <button
          onClick={(e) => {
            e.stopPropagation();
            const modal = document.getElementById(
              "my_modal_1"
            ) as HTMLDialogElement | null;
            modal?.showModal();
          }}
          className="flex gap-1 items-center justify-center btn btn-primary mb-8"
        >
          <CgAdd className="text-xl mr-1" />
          Add New Grade
        </button>
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
    </div>
  );
};

export default Grades;
