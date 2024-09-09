import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useGrades from "../../hooks/useGrades";
import { apiClient } from "../../services/api-client";

const AddStudent = () => {
  const { grades } = useGrades();
  const [isLoading, setIsLoading] = useState(false);

  const [studentObject, setStudentObject] = useState({
    name: "",
    dateOfBirth: "",
    gradeId: "",
    parentsName: "",
    address: "",
    phoneNumber: "",
    fee: {
      numberOfInstallments: "",
      totalAmount: "",
    },
  });

  const navigate = useNavigate();

  const validateForm = () => {
    const { name, parentsName, address, phoneNumber, gradeId, fee } =
      studentObject;

    if (!name || name.length < 3) {
      toast.error("Student name is required");
      return false;
    }
    if (!parentsName) {
      toast.error("Parent name is required");
      return false;
    }
    if (!address) {
      toast.error("Address is required");
      return false;
    }
    if (!phoneNumber) {
      toast.error("Phone number must be a valid 10-digit number");
      return false;
    }
    if (!gradeId) {
      toast.error("Grade must be selected");
      return false;
    }
    if (!fee.totalAmount || parseFloat(fee.totalAmount) <= 0) {
      toast.error("Total amount must be a positive number");
      return false;
    }
    if (!fee.numberOfInstallments || parseInt(fee.numberOfInstallments) <= 0) {
      toast.error("Number of installments must be a positive number");
      return false;
    }

    return true;
  };

  const handleCreateStudent = async () => {
    if (!validateForm()) return; // Stop if validation fails

    try {
      setIsLoading(true);
      await apiClient.post("/Students", studentObject, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setIsLoading(false);
      toast.success("Good Job, you have successfully Create Student Account.", {
        position: "top-center", // Change position to top-center
        style: {
          fontSize: "20px", // Adjust font size
          padding: "20px", // Increase padding
          width: "400px", // Increase width
          marginTop: "50px", // Add margin to move it lower
        },
      });
      setTimeout(() => {
        navigate("/students");
      }, 1500);
    } catch (error) {
      console.log("create student error => ", error);
      setIsLoading(false);
      toast.error("An error occurred while creating the student");
    }
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl mt-10 ml-8">Add New Student</h1>
      <ToastContainer />
      <div className="flex justify-center items-center mt-3">
        <img src="/images/student/profile.svg" alt="student" />
      </div>
      <div className="flex flex-wrap items-center max-w-3xl mx-auto  gap-x-8 gap-y-5 mt-8">
        <div className="flex flex-col gap-2 ">
          <h1 className="font-bold">Student Name</h1>
          <input
            type="text"
            className="input input-bordered min-w-80"
            onChange={(e) =>
              setStudentObject({
                ...studentObject,
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
            onChange={(e) =>
              setStudentObject({
                ...studentObject,
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
            onChange={(e) =>
              setStudentObject({
                ...studentObject,
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
            onChange={(e) =>
              setStudentObject({
                ...studentObject,
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
              const date = e.currentTarget.value;
              const now = new Date();
              const timePart = now.toTimeString().split(" ")[0];
              const msPart = now.getMilliseconds().toString().padStart(3, "0");

              const formattedDate = `${date}T${timePart}.${msPart}`;

              setStudentObject({
                ...studentObject,
                dateOfBirth: formattedDate,
              });
            }}
            value={studentObject?.dateOfBirth?.split("T")[0]}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="font-bold ">Student Grade</h1>
          <select
            className="select select-bordered min-w-80"
            onChange={(e) =>
              setStudentObject({
                ...studentObject,
                gradeId: e.currentTarget.value,
              })
            }
            value={studentObject?.gradeId}
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
            type="number"
            className="input input-bordered min-w-80"
            min={0}
            onChange={(e) =>
              setStudentObject({
                ...studentObject,
                fee: {
                  ...studentObject.fee,
                  totalAmount: e.currentTarget.value,
                },
              })
            }
          />
        </div>
        <div className="flex flex-col gap-2 ">
          <h1 className="font-bold">Number of Installments</h1>
          <input
            type="number"
            className="input input-bordered min-w-80"
            min={0}
            onChange={(e) =>
              setStudentObject({
                ...studentObject,
                fee: {
                  ...studentObject.fee,
                  numberOfInstallments: e.currentTarget.value,
                },
              })
            }
          />
        </div>
        <div className="flex justify-start items-center w-full mt-2">
          <button
            onClick={handleCreateStudent}
            className={`btn btn-accent mb-8  ${
              isLoading ? "animate-pulse" : ""
            } `}
          >
            {isLoading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;
