import { useEffect, useState } from "react";
import { apiClient } from "../services/api-client";

interface Student {
  id: number;
  name: string;
  dateOfBirth: string;
  gradeId: number;
}

const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const students = await apiClient.get("/Students");
        setStudents(students.data.$values);
        console.log(students.data);
      } catch (error) {
        console.log(error);
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
