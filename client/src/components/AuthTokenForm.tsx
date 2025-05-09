import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface AuthTokenFormProps {
  onTokenSaved: () => void;
}

const AuthTokenForm = ({ onTokenSaved }: AuthTokenFormProps) => {
  const [token, setToken] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  
  // Check if token already exists in localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const handleSaveToken = () => {
    if (!token.trim()) {
      setError("Please enter a valid authentication token");
      return;
    }

    // Save token to localStorage
    localStorage.setItem('auth_token', token.trim());
    onTokenSaved();
    setError(null);
  };
  
  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) {
        setToken(clipboardText);
      }
    } catch (err) {
      console.error("Failed to read clipboard:", err);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-800">Authentication Required</CardTitle>
        <CardDescription className="text-slate-600">
          Please enter your authentication token to proceed with API requests
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 p-3 rounded-md text-red-800 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="token" className="text-sm font-medium text-slate-700">
              API Authentication Token
            </Label>
            <div className="grid grid-cols-6 gap-2">
              <Input 
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter your Bearer token"
                className="px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition col-span-5"
              />
              <Button 
                type="button" 
                variant="outline"
                className="col-span-1"
                onClick={handlePaste}
              >
                Paste
              </Button>
            </div>
            <p className="text-xs text-slate-500">
              Token should be in the format: ory_at_kQfO... (from the provided curl command)
            </p>
          </div>
          
          <div className="pt-2">
            <Button
              type="button"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={handleSaveToken}
            >
              Save Token & Continue
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthTokenForm;