import { Helmet } from "react-helmet";
import UpdateForm from "@/components/update-form";

export default function Home() {
  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      <Helmet>
        <title>Update PAN/GSTIN Information</title>
        <meta name="description" content="Update your project's PAN and/or GSTIN details through our easy-to-use interface." />
        <meta property="og:title" content="Update PAN/GSTIN Information" />
        <meta property="og:description" content="Update your project's PAN and/or GSTIN information easily and securely." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Update PAN/GSTIN Information</h1>
          <p className="text-gray-600">Update your project's PAN and/or GSTIN details</p>
        </header>

        <UpdateForm />
      </div>
    </div>
  );
}
