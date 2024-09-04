import { useEffect, useState } from "react";
import { apiClient } from "../services/api-client";

interface Student {
  id: number;
  name: string;
  dateOfBirth: string;
  gradeId: number;
}

const useStudent = ({ id }: { id: number }) => {
  const [student, setStudent] = useState<Student>({} as Student);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      setIsLoading(true);
      if (id !== 0) {
        try {
          const student = await apiClient.get(`/Students/${id}`);
          setStudent(student.data);
          console.log("is this student =>", student.data);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchStudent();
  }, [id]);
  return {
    student,
    setStudent,
    isLoading,
    setIsLoading,
    error,
    setError,
  };
};
export default useStudent;
