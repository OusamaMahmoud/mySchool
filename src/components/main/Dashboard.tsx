import { FaMoneyBill, FaMoneyCheck } from "react-icons/fa";
import useStudents from "../../hooks/useStudents";
import { useEffect, useState } from "react";
import SchoolSkeleton from "../sub/SchoolSkeleton";

const Dashboard = () => {
  const { students } = useStudents();
  const [allFees, setAllFees] = useState<number>();
  const [reamingBalance, setReamingBalance] = useState<number>();
  useEffect(() => {
    const getAllFees = students.reduce((prev, current) => {
      return prev + parseFloat(current.fee.totalAmount); // Convert totalAmount to a number
    }, 0); // Initialize accumulator with 0
    setAllFees(getAllFees);

    const getReamingBalance = students.reduce((prev, current) => {
      return prev + parseFloat(current.fee.remainingBalance); // Convert totalAmount to a number
    }, 0); // Initialize accumulator with 0
    setReamingBalance(getReamingBalance);
  }, [students]);

  if (students.length <= 0) return <SchoolSkeleton />;

  return (
    <div className="flex gap-5 items-center justify-center mt-8">
      <div className="flex flex-col items-center justify-center border rounded-md p-8">
        <FaMoneyBill className="text-[100px] text-green-800" />
        <h1 className=" text-xl">All Students Fees: {allFees} OMR</h1>
      </div>
      <div className="flex flex-col items-center justify-center border rounded-md p-8">
        <FaMoneyCheck className="text-[100px] text-green-800" />
        <h1 className=" text-xl">Remaining Fees: {reamingBalance} OMR</h1>
      </div>
    </div>
  );
};

export default Dashboard;
