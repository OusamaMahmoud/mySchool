import useStudents, { Student } from "../../hooks/useStudents";
import { useNavigate } from "react-router-dom";
import useGrades from "../../hooks/useGrades";
import { FcNext, FcPrevious } from "react-icons/fc";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { UserOptions } from "jspdf-autotable";
import { useEffect, useState } from "react";
import { Installment } from "./TargetFee";
import { apiClient } from "../../services/api-client";
// Add this type declaration
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: UserOptions) => jsPDF;
  }
}
const Fees = () => {
  const {
    students,
    setPageNumber,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    searchQuery,
    setSearchQuery,
    hasMore,
    pageNumber,
  } = useStudents();

  const { grades } = useGrades();
  const navigate = useNavigate();

  const handleSortDirectionChange = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPageNumber(1); // Reset to the first page when searching
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Fees List", 20, 10);

    const tableColumn = [
      "Student Name",
      "Total Amount",
      "No Of Installments",
      "Amount Per Installment",
      "Grade",
    ];
    const tableRows = students.map((student: Student) => [
      student.name,
      student?.fee?.totalAmount,
      student?.fee?.numberOfInstallments,
      student?.fee?.amountPerInstallment,
      grades?.find((g) => g.id === Number(student.gradeId))?.gradeName || "",
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("fees_list.pdf");
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      students.map((student: Student) => ({
        "Student Name": student.name,
        "Total Amount": student.phoneNumber,
        "No Of Installments": student.address,
        "Amount Per Installment": student.dateOfBirth.split("T")[0],
        Grade:
          grades?.find((g) => g.id === Number(student.gradeId))?.gradeName ||
          "",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Fees");
    XLSX.writeFile(workbook, "fees_list.xlsx");
  };
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(students);
    let feeIds: number[];
    if (students) {
      feeIds = students.map((stu) => {
        return stu?.fee?.id;
      });
      console.log(feeIds);
    }

    const getInstallments = async () => {
      setLoading(true);
      setError(null);

      try {
        // Create an array of promises for each feeId
        const requests = feeIds.map((feeId) =>
          apiClient.get(`/installments/fee/${feeId}`)
        );

        // Use Promise.all to resolve all requests in parallel
        const responses = await Promise.all(requests);

        // Combine all the installments from each response
        const allInstallments = responses.flatMap((res) => res.data[0]);

        // Update the state with the combined installments
        setInstallments(allInstallments);
      } catch (err) {
        setError("Failed to fetch installments");
        console.error("Error fetching installments: ", err);
      } finally {
        setLoading(false);
      }
    };

    getInstallments();
  }, [students]);

  const getRemainingBalance = (idx:number): number => {
    if (!installments[idx]) return 0;
    return installments[idx]?.fee?.amountPerInstallment > installments[idx]?.amount
      ? installments[idx]?.remainingBalance
      : Number(installments[idx]?.fee?.totalAmount);
  };

  return (
    <div className="overflow-x-auto mt-10">
      <div className="flex flex-col mb-6">
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
        <div className="flex items-center gap-10">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="input input-bordered w-full max-w-xs"
          />
          <div className="flex items-center gap-6">
            <label htmlFor="sortBy" className="whitespace-nowrap">
              Sort By:{" "}
            </label>
            <select
              id="sortBy"
              className="select select-bordered"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Select Sort </option>
              <option value="Name">Student Name</option>
            </select>

            {/* Sort Direction Toggle */}
            <button
              className="btn bg-[#091F5B] text-white"
              onClick={handleSortDirectionChange}
            >
              {sortDirection === "asc" ? "Ascending" : "Descending"}
            </button>
          </div>
        </div>
      </div>
      <table className="table w-full">
        <thead>
          <tr className="bg-[#EAECF0] font-heading">
            <th className="text-left">Student Name</th>
            <th className="text-left  ">Grade</th>
            <th className="text-left  ">Fees</th>
            <th className="text-left  ">Installments</th>
            <th className="text-left  ">Amount Per Installment</th>
            <th className="text-left  ">Remaining Balance</th>
            <th className="text-left  ">Action</th>
          </tr>
        </thead>
        <tbody>
          {students?.map((stu ,idx) => (
            <tr key={stu?.id}>
              <td className="text-lg font-bold font-heading capitalize">
                {stu?.name}
              </td>
              <td className="">
                {grades?.find((g) => g.id === Number(stu.gradeId))?.gradeName}
              </td>
              <td className="">{stu?.fee?.totalAmount}</td>
              <td className="">{stu?.fee?.numberOfInstallments}</td>
              <td className="">{stu?.fee?.amountPerInstallment}</td>
              {/* <td className="">
                {installments &&
                  installments?.find(
                    (installment) => installment?.feeId == stu?.fee.id
                  )?.remainingBalance}
              </td> */}
              <td> {installments[idx] ? getRemainingBalance(idx) : ""}</td>
              <td
                onClick={() =>
                  navigate(`/fees/${stu.fee.id}`, {
                    state: { studentName: stu?.name },
                  })
                }
                className="btn hover:bg-[#1a2f6c] bg-[#091F5B]  text-white my-1"
              >
                Pay
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
          Previous Page
        </button>

        <button
          className="btn btn-accent text-white"
          onClick={handleNextPage}
          disabled={!hasMore}
        >
          Next Page <FcNext />
        </button>
      </div>
    </div>
  );
};

export default Fees;
