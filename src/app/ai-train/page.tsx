import { supabase } from "@/../hh/src/lib/supabase";
import { FaceProfile } from "@/../hh/src/lib/supabase";
import { useState } from "react";

export default function AITrainPage() {
  const [modelName, setModelName] = useState("");
  const [trainingData, setTrainingData] = useState<FaceProfile[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);

  const fetchTrainingData = async () => {
    const { data, error } = await supabase
      .from("face_profiles")
      .select("*")
      .limit(100);
    
    if (data) setTrainingData(data);
  };

  const trainModel = async () => {
    setIsTraining(true);
    setProgress(0);
    
    // Simulate training progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">AI Model Training</h1>
      
      <div className="space-y-6">
        <div>
          <label className="block mb-2">Model Name</label>
          <input
            type="text"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>

        <div>
          <button 
            onClick={fetchTrainingData}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Load Training Data
          </button>
          <div className="mt-2">
            {trainingData.length > 0 && (
              <p>Loaded {trainingData.length} face profiles</p>
            )}
          </div>
        </div>

        <div>
          <button
            onClick={trainModel}
            disabled={isTraining || !modelName}
            className={`px-4 py-2 rounded ${
              isTraining || !modelName
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 text-white"
            }`}
          >
            {isTraining ? "Training..." : "Train Model"}
          </button>
          {isTraining && (
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}