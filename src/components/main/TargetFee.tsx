import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "../../services/api-client";
import { toast, ToastContainer } from "react-toastify";
export interface Installment {
  id: number;
  amount: number;
  isPaid: boolean;
}
const TargetFee = () => {
  const params = useParams();
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const getFeeInstallments = async () => {
      try {
        const res = await apiClient.get(`/installments/fee/${params.id}`);
        setInstallments(res.data);
        console.log(res.data);
      } catch (error) {
        console.log("feeInstallments =>", error);
      }
    };
    getFeeInstallments();
  }, []);

  const targetInstallments = installments?.filter(
    (inst) => inst.isPaid === false
  );

  const handlePayBtn = async () => {
    if (targetInstallments && targetInstallments?.length > 0) {
      const requestedObj = {
        installmentId: targetInstallments[0].id,
        amountPaid: targetInstallments[0].amount,
      };
      try {
        const res = await apiClient.post(
          `/installments/pay?installmentId=${requestedObj.installmentId}&amountPaid=${requestedObj.amountPaid}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Good Job, you have successfully paid.", {
          position: "top-center", // Change position to top-center
          style: {
            fontSize: "20px", // Adjust font size
            padding: "20px", // Increase padding
            width: "400px", // Increase width
            marginTop: "50px", // Add margin to move it lower
          },
        });
        setTimeout(() => {
          navigate("/fees");
        }, 2000);
      } catch (error) {
        console.log("Not Pay!! =>", error);
        toast.error("Oops! Sorry Something Went Wrong!");
      }
    }
  };
  return (
    <div>
      <div className="bg-[#091F5B] h-36 flex justify-between items-center ">
        <div className="ml-6 flex gap-4 ">
          <img src="/images/student/profile.svg" />
          <div className="mt-10">
            <h1 className="font-bold text-xl text-white ">{}</h1>
          </div>
        </div>
        <div className="flex justify-end h-36">
          <div className="relative flex w-20 ">
            <img
              src="/images/student/profileBackground.svg"
              className="w-16 h-16 absolute right-[-111px]  bottom-[-20px] "
            />
          </div>
          <div className="relative flex w-20 ">
            <img
              src="/images/student/profileBackground.svg"
              className="w-16 h-16 absolute right-[-97px] top-[-12px] "
            />
          </div>
          <div className="relative flex w-20 ">
            <img
              src="/images/student/profileBackground.svg"
              className="w-16 h-16 absolute right-[133px] top-0"
            />
          </div>
        </div>
      </div>
      <ToastContainer />
      <div className="flex flex-col justify-center items-center border rounded-md p-4 mt-6">
        {targetInstallments && targetInstallments.length > 0 && (
          <div className="flex ">
            <p className="font-bold text-xl my-4 justify-self-end w-fit">
              You have{" "}
              <span className="text-2xl">{targetInstallments?.length}</span>{" "}
              installments remaining.
            </p>
          </div>
        )}
        <h1 className="font-bold text-2xl my-4">Payment Method</h1>
        <div className="flex gap-10 mt-4">
          <div className="flex gap-3 items-center">
            <input
              type="radio"
              name="radio-1"
              className="radio radio-primary"
            />
            <h2 className="font-bold text-4xl">Cash</h2>
          </div>
          <div className="flex gap-3 items-center">
            <input
              type="radio"
              name="radio-1"
              className="radio radio-primary"
            />
            <h2 className="font-bold text-4xl">Visa</h2>
          </div>
        </div>
        <div className="mt-8 flex flex-col justify-center items-center">
          {targetInstallments && targetInstallments.length > 0 ? (
            <p className="font-bold font-body text-xl mb-2">
              Pay an Installment: {targetInstallments[0]?.amount} OMR
            </p>
          ) : (
            <p className="text-lg bg-green-300 rounded-md px-4 p-2 text-white ">
              All Fees Has Been Paid.
            </p>
          )}
          {targetInstallments && targetInstallments.length > 0 && (
            <button
              onClick={handlePayBtn}
              className={`btn px-8 btn-accent mt-4`}
            >
              Pay
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TargetFee;
