import { useEffect } from "react";
import LegalInfoForm from "@/components/LegalInfoForm";

const Home = () => {
  useEffect(() => {
    document.title = "Update PAN/GSTIN Information | Livspace";
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-slate-100">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-slate-800">Update Legal Information</h1>
          <p className="mt-2 text-slate-600">Update PAN and/or GSTIN details for your project</p>
        </div>
        
        {/* Main Form Card */}
        <LegalInfoForm />
        
        {/* Footer */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Livspace. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
