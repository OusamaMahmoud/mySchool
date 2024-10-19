import { useEffect, useState } from "react";
import { apiClient } from "../services/api-client";

export interface EducationalStage {
  id: string;
  name: string;
}

const useEduStages = () => {
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const [isFetchEduStagesLoading, setIsFetchEduStagesLoading] = useState(false);

  const [educationalStages, setEducationalStages] = useState<
    EducationalStage[]
  >([]);
  const [pageNumber, setPageNumber] = useState(1); // Keep track of the current page
  const [pageSize] = useState(8); // Page size can be fixed or dynamic
  const [hasMore, setHasMore] = useState(true); // To know if there are more students to fetch

  useEffect(() => {
    const getEducationalStages = async () => {
      try {
        setIsFetchEduStagesLoading(true);
        const res = await apiClient.get(
          `/EducationalStages?searchTerm=${searchQuery}&pageNumber=${pageNumber}&pageSize=${pageSize}`
        );
        if (res.data.length < pageSize) {
          setHasMore(false); // If the number of students fetched is less than pageSize, there are no more students.
        } else {
          setHasMore(true); // If the number of students fetched is less than pageSize, there are no more students.
        }
        setEducationalStages(res.data);
        setIsFetchEduStagesLoading(false);
        console.log(res.data);
      } catch (error) {
        console.log(error);
        setIsFetchEduStagesLoading(false);
      }
    };
    getEducationalStages();
  }, [searchQuery, pageNumber]);

  return {
    educationalStages,
    setEducationalStages,
    setSearchQuery,
    isFetchEduStagesLoading,
    setIsFetchEduStagesLoading,
    pageNumber,
    setPageNumber,
    hasMore,
  };
};
export default useEduStages;
