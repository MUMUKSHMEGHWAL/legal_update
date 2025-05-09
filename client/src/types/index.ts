export interface LegalInfoPayload {
  pan?: {
    identifier_string: string;
    metadata: {
      NAME: string;
    };
  };
  gstin?: {
    identifier_string: string;
  };
}

export interface LegalInfoFormData {
  projectId: string;
  panNumber: string;
  gstinNumber: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}
