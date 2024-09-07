import React, { useEffect, useState } from "react";
import { apiClient } from "../../services/api-client";
import { BiEdit } from "react-icons/bi";
import { FiDelete } from "react-icons/fi";
import { LuDelete } from "react-icons/lu";
import { MdDeleteForever } from "react-icons/md";
import { Link } from "react-router-dom";
import { CgAdd } from "react-icons/cg";

interface Grade {
  id: string;
  gradeName: string;
  educationalStageId: string;
}
const Grades = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [newGrade, setNewGrade] = useState({
    gradeName: "",
    educationalStageId: "",
  });

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

  return (
    <div className="overflow-x-auto mt-10">
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
              <select className="select select-bordered min-w-80"></select>
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
            }}
          >
            Add
          </button>
        </div>
      </dialog>
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
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center max-w-3xl mx-auto  gap-x-8 gap-y-5 mt-8 mb-8">
            <div className="flex flex-col gap-2 ">
              <h1 className="font-bold">Educational Stage</h1>
              <select className="select select-bordered min-w-80"></select>
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
            }}
          >
            Edit
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
                {grd?.educationalStageId}
              </td>
              <td className="flex text-lg font-bold font-heading capitalize">
                <BiEdit
                  onClick={(e) => {
                    e.stopPropagation();
                    const modal = document.getElementById(
                      "my_modal_2"
                    ) as HTMLDialogElement | null;
                    modal?.showModal();
                  }}
                  className="mr-5 text-2xl hover:text-yellow-300 border "
                />
                <MdDeleteForever className=" text-2xl hover:text-red-500 " />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Grades;
