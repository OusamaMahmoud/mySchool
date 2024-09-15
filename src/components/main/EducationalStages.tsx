import { toast } from "react-toastify";
import useEduStages, { EducationalStage } from "../../hooks/useEduStages";
import { apiClient } from "../../services/api-client";
import { useEffect, useState } from "react";
import { CgAdd } from "react-icons/cg";
import { BiEdit } from "react-icons/bi";
import { MdDeleteForever } from "react-icons/md";

const EducationalStages = () => {
  const [targetEducationalStage, setEducationalStage] =
    useState<EducationalStage>({} as EducationalStage);
  const [targetEducationalStageId, setTargetEducationalStageId] = useState("");
  const [isLoading] = useState(false);

  const [newEducationalStage, setNewEducationalStage] = useState({
    name: "",
  });

  const { educationalStages, setEducationalStages } = useEduStages();

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
    try {
      await apiClient.post("/EducationalStages", newEducationalStage, {
        headers: {
          "Content-Type": "application/json", // Set the correct content type
        },
      });
      toast.success("Successfully Create Educational Stage.");
      const modal = document.getElementById(
        "my_modal_1"
      ) as HTMLDialogElement | null;
      modal?.close();
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

      <div className="flex justify-end">
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
      </div>
      <table className="table w-full">
        <thead>
          <tr className="bg-[#EAECF0] font-heading">
            <th className="text-left">Id</th>
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
                {edu?.id}
              </td>
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
    </div>
  );
};

export default EducationalStages;
