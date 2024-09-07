import { CgAdd } from "react-icons/cg";
import useStudents from "../../hooks/useStudents";
import { Link, useNavigate } from "react-router-dom";
import useGrades from "../../hooks/useGrades";

const Fees = () => {
  const { students } = useStudents();
  const { grades } = useGrades();

  const navigate = useNavigate();
  return (
    <div className="overflow-x-auto mt-10">
      <table className="table w-full">
        <thead>
          <tr className="bg-[#EAECF0] font-heading">
            <th className="text-left p-2">ID</th>
            <th className="text-left">Student Name</th>
            <th className="text-left  ">Grade</th>
            <th className="text-left  ">Fees</th>
            <th className="text-left  ">Installments</th>
            <th className="text-left  ">Amount Per Installment</th>
          </tr>
        </thead>
        <tbody>
          {students?.map((stu) => (
            <tr
              key={stu?.id}
              className="hover:bg-gray-100 transition-all duration-200 cursor-pointer"
              onClick={() => navigate(`/fees/${stu.fee.id}`)}
            >
              <td className="p-2">{stu?.fee?.id}</td>
              <td className="text-lg font-bold font-heading capitalize">
                {stu?.name}
              </td>
              <td className="">
                {grades?.find((g) => g.id === Number(stu.gradeId))?.gradeName}
              </td>
              <td className="">{stu?.fee?.totalAmount}</td>
              <td className="">{stu?.fee?.numberOfInstallments}</td>
              <td className="">{stu?.fee?.amountPerInstallment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Fees;
