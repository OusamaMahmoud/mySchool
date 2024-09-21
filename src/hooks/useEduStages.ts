import { useEffect, useState } from "react";
import { apiClient } from "../services/api-client";

export interface EducationalStage {
  id: string;
  name: string;
}

const useEduStages = () => {
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query

  const [educationalStages, setEducationalStages] = useState<
    EducationalStage[]
  >([]);

  useEffect(() => {
    const getEducationalStages = async () => {
      try {
        const res = await apiClient.get(
          `/EducationalStages?searchTerm=${searchQuery}`
        );
        setEducationalStages(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getEducationalStages();
  }, [searchQuery]);

  return {
    educationalStages,
    setEducationalStages,
    setSearchQuery
  };
};
export default useEduStages;
