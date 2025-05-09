import { z } from "zod";

// Regular expressions for validation
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export const legalInfoSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  panNumber: z.string().refine((val) => {
    // Empty is valid as PAN is optional
    if (!val) return true;
    return PAN_REGEX.test(val);
  }, {
    message: "PAN should be 10 characters (5 letters, 4 numbers, 1 letter)"
  }),
  gstinNumber: z.string().refine((val) => {
    // Empty is valid as GSTIN is optional
    if (!val) return true;
    return GSTIN_REGEX.test(val);
  }, {
    message: "GSTIN should be 15 characters long"
  })
}).refine((data) => {
  // At least one of panNumber or gstinNumber should be provided
  return data.panNumber || data.gstinNumber;
}, {
  message: "Enter at least one of PAN or GSTIN to update",
  path: ["panNumber"]
});

export type LegalInfoSchema = z.infer<typeof legalInfoSchema>;
