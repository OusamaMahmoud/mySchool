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

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const students = await apiClient.get(
          "/Students?sortBy=Name&sortDirection=asc&pageNumber=1&pageSize=10"
        );
        setStudents(students.data);
        console.log("is=>", students.data);
      } catch (error) {
        console.log("is this stu error? ", error);
      }
    };
    fetchStudents();
  }, []);

  return {
    students,
    setStudents,
    isLoading,
    setIsLoading,
    error,
    setError,
  };
};
export default useStudents;
