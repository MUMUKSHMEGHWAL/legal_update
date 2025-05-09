import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle, AlertTriangle, Loader2, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { legalInfoSchema } from "@/lib/form-schema";
import { updateLegalInfo } from "@/lib/api";
import { LegalInfoFormData, LegalInfoPayload } from "@/types";

const LegalInfoForm = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Define form with validation schema
  const form = useForm<LegalInfoFormData>({
    resolver: zodResolver(legalInfoSchema),
    defaultValues: {
      projectId: "",
      panNumber: "",
      gstinNumber: "",
    },
  });

  // Mutation for API call
  const mutation = useMutation({
    mutationFn: (data: { projectId: string; payload: LegalInfoPayload }) => {
      return updateLegalInfo(data.projectId, data.payload);
    },
    onSuccess: () => {
      setSuccessMessage("Information updated successfully!");
      setErrorMessage(null);
      form.reset();
      
      // Auto hide success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    },
    onError: (error: Error) => {
      setErrorMessage(error.message || "There was an error updating the information. Please try again.");
      setSuccessMessage(null);
      
      // Auto hide error message after 5 seconds
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    },
  });

  const onSubmit = (data: LegalInfoFormData) => {
    // Reset alerts
    setSuccessMessage(null);
    setErrorMessage(null);

    // Construct payload
    const payload: LegalInfoPayload = {};

    if (data.panNumber) {
      payload.pan = {
        identifier_string: data.panNumber,
        metadata: {
          NAME: "",
        },
      };
    }

    if (data.gstinNumber) {
      payload.gstin = {
        identifier_string: data.gstinNumber,
      };
    }

    // Submit via mutation
    mutation.mutate({
      projectId: data.projectId,
      payload,
    });
  };

  return (
    <>
      {/* Success Alert */}
      {successMessage && (
        <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <Alert className="mb-6 bg-red-50 border-red-200 text-red-800">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Main Form Card */}
      <Card className="bg-white shadow-md mb-6">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Auth info */}
              <div className="bg-blue-50 p-3 rounded-md mb-4">
                <p className="text-sm text-blue-700">
                  Using authentication token: {localStorage.getItem('auth_token')?.substring(0, 10)}...
                </p>
              </div>
              
              {/* Project ID Field */}
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Project ID <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter project ID"
                        className="px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              {/* PAN Number Field */}
              <FormField
                control={form.control}
                name="panNumber"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-slate-700">
                      PAN Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. ABCDE1234F"
                        className="px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none uppercase transition"
                        maxLength={10}
                        onChange={(e) => {
                          // Convert to uppercase
                          e.target.value = e.target.value.toUpperCase();
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                    <p className="text-xs text-slate-500">
                      Format: 5 letters, 4 numbers, 1 letter
                    </p>
                  </FormItem>
                )}
              />

              {/* GSTIN Number Field */}
              <FormField
                control={form.control}
                name="gstinNumber"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-slate-700">
                      GSTIN Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. 06AAACY6481A1ZH"
                        className="px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none uppercase transition"
                        maxLength={15}
                        onChange={(e) => {
                          // Convert to uppercase
                          e.target.value = e.target.value.toUpperCase();
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                    <p className="text-xs text-slate-500">
                      Format: 15 characters (2 digits, 10 PAN characters, 1 entity number, 1 Z, 1 check digit)
                    </p>
                  </FormItem>
                )}
              />

              {/* Validation Message */}
              <p className={`text-sm ${form.formState.errors.panNumber && !form.getValues().gstinNumber ? "text-red-500" : "text-amber-600"}`}>
                Enter at least one of PAN or GSTIN to update
              </p>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Information"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center p-4 border-t border-slate-200">
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            className="text-slate-600 hover:text-red-600 flex items-center gap-1"
            onClick={() => {
              localStorage.removeItem('auth_token');
              window.location.reload();
            }}
          >
            <LogOut className="h-4 w-4" />
            Change Authentication Token
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default LegalInfoForm;