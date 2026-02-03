import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search } from "lucide-react";

interface TaskInputScreenProps {
  onSubmit: (taskId: string, apiKey: string) => void;
}

export function TaskInputScreen({ onSubmit }: TaskInputScreenProps) {
  const [taskId, setTaskId] = useState("");
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_CLICKUP_API_KEY || "");
  const [error, setError] = useState("");

  console.log("API Key from env:", import.meta.env.VITE_CLICKUP_API_KEY);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!taskId.trim()) {
      setError("Please enter a list ID");
      return;
    }

    if (!apiKey.trim()) {
      setError("Please enter your ClickUp API key");
      return;
    }

    onSubmit(taskId.trim(), apiKey.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Wingman Logo with Gradient */}
        <div className="text-center space-y-6">
          <h1 className="text-7xl font-bold tracking-tight mb-2">
            <span className="bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 bg-clip-text text-transparent">
              Wingman
            </span>
          </h1>
          <p className="text-gray-600 text-base">ClickUp Dashboard</p>
        </div>

        {/* Search Box - Google Style */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* API Key Input (if needed) */}
            {!import.meta.env.VITE_CLICKUP_API_KEY && (
              <div className="relative">
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Enter your ClickUp API Key (pk_...)"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="h-12 px-6 text-base border border-gray-300 rounded-full hover:shadow-md focus:shadow-lg transition-shadow duration-200"
                />
              </div>
            )}
            
            {/* List ID Input with 3D Shadow - Google Style */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-orange-50 rounded-full blur-xl opacity-30"></div>
              <div className="relative flex items-center bg-white border border-gray-300 rounded-full hover:shadow-lg focus-within:shadow-xl transition-all duration-200">
                <Search className="ml-6 h-5 w-5 text-gray-400" />
                <Input
                  id="taskId"
                  type="text"
                  placeholder="Enter ClickUp Task ID"
                  value={taskId}
                  onChange={(e) => setTaskId(e.target.value)}
                  className="h-14 flex-1 px-4 text-base border-0 rounded-full focus:ring-0 focus:outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-sm text-red-500 text-center">{error}</div>
            )}

            {/* Action Buttons - Google Style with Orange Primary */}
            <div className="flex justify-center gap-4 pt-4">
              <Button 
                type="submit" 
                className="h-11 px-8 bg-orange-500 hover:bg-orange-600 text-white border-0 rounded-full shadow-sm hover:shadow-md transition-all font-normal"
              >
                Analyze Task
              </Button>
              <Button 
                type="button"
                className="h-11 px-8 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-all font-normal"
                variant="outline"
                onClick={() => {
                  setTaskId("901613154061");
                }}
              >
                I'm Feeling Lucky
              </Button>
            </div>

            {/* Helper Text */}
            <p className="text-center text-sm text-gray-500 pt-2">
              Enter a task ID from your ClickUp workspace
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
