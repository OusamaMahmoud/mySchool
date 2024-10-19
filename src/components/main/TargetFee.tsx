import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { apiClient } from "../../services/api-client";
import { toast, ToastContainer } from "react-toastify";
import SchoolSkeleton from "../sub/SchoolSkeleton";
export interface Installment {
  id: number;
  amount: number;
  isPaid: boolean;
  remainingBalance: number;
  feeId: number;
  fee: {
    totalAmount: string;
    amountPerInstallment: number;
  };
}
const TargetFee = () => {
  const params = useParams();
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [amount, setAmount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { studentName } = location.state || { studentName: 9 }; // Default to 0 if not passed
  const [isPayingLoading, setPayingLoading] = useState(false);
  useEffect(() => {
    const getFeeInstallments = async () => {
      try {
        const res = await apiClient.get(`/installments/fee/${params.id}`);
        setInstallments(res.data);
        console.log("installments =>", res.data);
      } catch (error) {
        console.log("feeInstallments =>", error);
      }
    };
    getFeeInstallments();
  }, []);

  const handlePayBtn = async () => {
    if (amount < 0) {
      toast.warning("Please Provide A Positive Number");
      return;
    }

    if (getRemainingBalance() <= 0) {
      toast.warning("All fees have been successfully paid.");
      return;
    }
    if (amount > getRemainingBalance()) {
      toast.warning("The entered amount exceeds the remaining installment.");
      return;
    }

    const requestedObj = {
      installmentId: installments[0].id,
      amountPaid: amount,
    };
    try {
      setPayingLoading(true);
      const res = await apiClient.post(
        `/installments/pay?installmentId=${requestedObj.installmentId}&amountPaid=${requestedObj.amountPaid}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res.data);
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
        setPayingLoading(false);
        navigate("/fees", {
          state: { remainingBalance: res?.data?.remainingBalance },
        }); // Pass the remaining balance to fees page
      }, 2000);
    } catch (error: any) {
      console.log("Not Pay!! =>", error);
      setPayingLoading(false);
      toast.error(error.response.data);
    }
  };

  const handlePayingAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.currentTarget.value));
  };
  const getRemainingBalance = (): number => {
    if (!installments[0]) return 0;
    return installments[0]?.fee?.amountPerInstallment > installments[0]?.amount
      ? installments[0]?.remainingBalance
      : Number(installments[0]?.fee?.totalAmount);
  };

  if(installments.length <= 0) return <SchoolSkeleton />
  return (
    <div>
      <div className="bg-[#091F5B] h-36 flex justify-between items-center ">
        <div className="ml-6 flex gap-4 ">
          <img src="/images/student/profile.svg" />
          <div className="mt-10">
            <h1 className="font-bold text-xl text-white "></h1>
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

      <div className="flex flex-col ">
        <div className="flex gap-4 items-center mt-4 ">
          <p className="text-lg font-bold">Student Name:</p>
          <h1 className="text-xl font-semibold capitalize">{studentName}</h1>
        </div>
        <div className="flex gap-6 items-center mt-4 bg-red-200 p-2 rounded-md w-fit">
          <h1 className="text-xl font-bold">Remaining Balance:</h1>
          <p className="text-xl font-bold">
            {installments[0] ? getRemainingBalance() : ""}
          </p>
        </div>
        <div className="flex flex-col gap-2 mt-10">
          <label className="text-lg font-semibold">
            Provide Installment Amount
          </label>
          <input
            className="input input-bordered grow"
            onChange={handlePayingAmount}
            type="number"
            min={0}
            placeholder="Amount..."
          />
          <button
            onClick={handlePayBtn}
            disabled={isPayingLoading}
            className="btn bg-[#091F5B]  mt-2 text-white w-28"
          >
            {isPayingLoading ? "Paying..." : "Pay"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TargetFee;
