import { useEffect, useState } from "react";
import { apiClient } from "../services/api-client";

export interface EducationalStage {
  id: string;
  name: string;
}

const useEduStages = () => {
  const [educationalStages, setEducationalStages] = useState<
    EducationalStage[]
  >([]);

  useEffect(() => {
    const getEducationalStages = async () => {
      try {
        const res = await apiClient.get("/EducationalStages");
        setEducationalStages(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getEducationalStages();
  }, []);

  return {
    educationalStages,
    setEducationalStages,
  };
};
export default useEduStages;
