import { useEffect, useState } from "react";
import { apiClient } from "../services/api-client";

interface Grade {
  id: number;
  gradeName: string;
  educationalStageId: number;
}

const useGrades = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const grades = await apiClient.get("/Grades");
        setGrades(grades.data);
        console.log(grades.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchStudents();
  }, []);

  return {
    grades,
    setGrades,
    isLoading,
    setIsLoading,
    error,
    setError,
  };
};
export default useGrades;
