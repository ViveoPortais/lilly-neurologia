
import api from "./api";

const programCode = `${process.env.NEXT_PUBLIC_PROGRAM_CODE}`;

export const getStringMaps = async (entityName : string, attributeName : string) => {
 const response = await api.get("/StringMap/getbasicstringmaplist", {
  params: {
   entityName: entityName,
   attributeName: attributeName,
   programcode: programCode,
  },
 });
 return response.data;
};