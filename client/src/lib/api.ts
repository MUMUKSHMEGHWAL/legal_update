import { LegalInfoPayload } from "@/types";
import { apiRequest } from "./queryClient";

export const updateLegalInfo = async (projectId: string, payload: LegalInfoPayload) => {
  try {
    const response = await apiRequest(
      'PUT',
      `/api/projects/${projectId}/legal`,
      payload
    );
    
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unknown error occurred');
  }
};
