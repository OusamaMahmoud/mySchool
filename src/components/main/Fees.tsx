import useStudents from "../../hooks/useStudents";
import { useNavigate } from "react-router-dom";
import useGrades from "../../hooks/useGrades";
import { FcNext, FcPrevious } from "react-icons/fc";
import { useState } from "react";

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

  return (
    <div className="overflow-x-auto mt-10">
      <div className="flex justify-between items-center mb-6">
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
              <option value="Name">Student Name</option>
              <option value="ParentsName">Parent Name</option>
              <option value="PhoneNumber">Phone Number</option>
              <option value="DateOfBirth">Date of Birth</option>
              <option value="TotalAmount">Fees</option>
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
            <th className="text-left p-2">ID</th>
            <th className="text-left">Student Name</th>
            <th className="text-left  ">Grade</th>
            <th className="text-left  ">Fees</th>
            <th className="text-left  ">Installments</th>
            <th className="text-left  ">Amount Per Installment</th>
            <th className="text-left  ">Action</th>
          </tr>
        </thead>
        <tbody>
          {students?.map((stu) => (
            <tr
              key={stu?.id}
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

              <td
                onClick={() => navigate(`/fees/${stu.fee.id}`)}
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
