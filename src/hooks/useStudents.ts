import { useEffect, useState } from "react";
import { apiClient } from "../services/api-client";

export interface Student {
  id: number;
  name: string;
  fee: {
    id: number;
    studentId: number;
    amountPerInstallment: string;
    numberOfInstallments: string;
    totalAmount: string;
  };
  parentsName: string;
  address: string;
  phoneNumber: string;
  dateOfBirth: string;
  gradeId: string;
}

const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [pageNumber, setPageNumber] = useState(1); // Keep track of the current page
  const [pageSize] = useState(8); // Page size can be fixed or dynamic
  const [hasMore, setHasMore] = useState(true); // To know if there are more students to fetch
  const [sortBy, setSortBy] = useState("Name"); // Default sorting by name
  const [sortDirection, setSortDirection] = useState("asc"); // Default ascending order
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const students = await apiClient.get(
          `/Students?searchTerm=${searchQuery}&sortBy=${sortBy}&sortDirection=${sortDirection}&pageNumber=${pageNumber}&pageSize=${pageSize}`
        );
        console.log(students)
        if (students.data.length < pageSize) {
          setHasMore(false); // If the number of students fetched is less than pageSize, there are no more students.
        } else {
          setHasMore(true); // If the number of students fetched is less than pageSize, there are no more students.
        }
        setStudents(students.data);
        console.log("is=>", students.data);
      } catch (error) {
        console.log("is this stu error? ", error);
      }
    };
    fetchStudents();
  }, [pageNumber, sortBy, sortDirection, searchQuery]);

  return {
    students,
    setStudents,
    isLoading,
    setIsLoading,
    error,
    setError,
    setPageNumber,
    pageNumber,
    hasMore, // Return whether there are more students to load
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    searchQuery,
    setSearchQuery,
  };
};
export default useStudents;
