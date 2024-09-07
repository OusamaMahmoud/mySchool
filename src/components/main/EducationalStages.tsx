import React, { useEffect, useState } from "react";
import { apiClient } from "../../services/api-client";

interface EducationalStage {
  id: string;
  name: string;
}
const EducationalStages = () => {
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

  return (
    <div className="overflow-x-auto mt-10">
      <table className="table w-full">
        <thead>
          <tr className="bg-[#EAECF0] font-heading">
            <th className="text-left">Id</th>
            <th className="text-left">Educational Stage</th>
          </tr>
        </thead>
        <tbody>
          {educationalStages?.map((edu, idx) => (
            <tr
              key={idx}
              className="hover:bg-gray-100 transition-all duration-200 cursor-pointer"
            >
              <td className="text-lg font-bold font-heading capitalize">
                {edu?.id}
              </td>
              <td className="text-lg font-bold font-heading capitalize">
                {edu?.name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EducationalStages;
