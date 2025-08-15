import { useState } from "react";
import "./App.css";
import axios from "axios";

import logo from "./assets/logo.png";

export default function App() {
  const [activeTab, setActiveTab] = useState("file");
  const [loading, setLoading] = useState(false);
  const [classification, setClassification] = useState(null);
  const [detection, setDetection] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  // File upload state
  const [file, setFile] = useState(null);

  // URL input state
  const [imageUrl, setImageUrl] = useState("");

  // ===== Classification Model Settings =====
  const CLASSIFICATION_KEY = "c075a3e84daa43758044157a4a08cd4d";
  const CLASSIFICATION_REGION = "australiaeast";
  const CLASSIFICATION_PROJECT_ID = "06375004-08d0-4249-a5ed-a4f459bdf2b3";
  const CLASSIFICATION_ITERATION = "Iteration1";

  const CLASSIFICATION_FILE_URL = `https://${CLASSIFICATION_REGION}.api.cognitive.microsoft.com/customvision/v3.0/Prediction/${CLASSIFICATION_PROJECT_ID}/classify/iterations/${CLASSIFICATION_ITERATION}/image`;
  const CLASSIFICATION_URL_URL = `https://${CLASSIFICATION_REGION}.api.cognitive.microsoft.com/customvision/v3.0/Prediction/${CLASSIFICATION_PROJECT_ID}/classify/iterations/${CLASSIFICATION_ITERATION}/url`;

  // ===== Object Detection Model Settings =====
  const DETECTION_KEY = "c075a3e84daa43758044157a4a08cd4d";
  const DETECTION_REGION = "australiaeast"; // same or different
  const DETECTION_PROJECT_ID = "9c41e726-0c1b-41ba-8609-d59236a5c242";
  const DETECTION_ITERATION = "Iteration1";

  const DETECTION_FILE_URL = `https://${DETECTION_REGION}.api.cognitive.microsoft.com/customvision/v3.0/Prediction/${DETECTION_PROJECT_ID}/detect/iterations/${DETECTION_ITERATION}/image`;
  const DETECTION_URL_URL = `https://${DETECTION_REGION}.api.cognitive.microsoft.com/customvision/v3.0/Prediction/${DETECTION_PROJECT_ID}/detect/iterations/${DETECTION_ITERATION}/url`;

  const resetPredictions = () => {
    setClassification(null);
    setDetection([]);
  };

  const handleFilePredict = async () => {
    if (!file) return alert("Please select an image file");
    resetPredictions();
    setImagePreview(URL.createObjectURL(file));
    setLoading(true);

    try {
      const [classRes, detectRes] = await Promise.all([
        axios.post(CLASSIFICATION_FILE_URL, file, {
          headers: {
            "Prediction-Key": CLASSIFICATION_KEY,
            "Content-Type": "application/octet-stream",
          },
        }),
        axios.post(DETECTION_FILE_URL, file, {
          headers: {
            "Prediction-Key": DETECTION_KEY,
            "Content-Type": "application/octet-stream",
          },
        }),
      ]);

      setClassification(classRes.data.predictions[0]);
      setDetection(detectRes.data.predictions);
    } catch (err) {
      console.error(err);
      alert("Error predicting from file");
    }
    setLoading(false);
  };

  const handleUrlPredict = async () => {
    if (!imageUrl) return alert("Please enter an image URL");
    resetPredictions();
    setImagePreview(imageUrl);
    setLoading(true);

    try {
      const [classRes, detectRes] = await Promise.all([
        axios.post(
          CLASSIFICATION_URL_URL,
          { url: imageUrl },
          {
            headers: {
              "Prediction-Key": CLASSIFICATION_KEY,
              "Content-Type": "application/json",
            },
          }
        ),
        axios.post(
          DETECTION_URL_URL,
          { url: imageUrl },
          {
            headers: {
              "Prediction-Key": DETECTION_KEY,
              "Content-Type": "application/json",
            },
          }
        ),
      ]);

      setClassification(classRes.data.predictions[0]);
      setDetection(detectRes.data.predictions);
    } catch (err) {
      console.error(err);
      alert("Error predicting from URL");
    }
    setLoading(false);
  };

  // ===== Draw bounding boxes =====
  // const renderBoundingBoxes = () => {
  //   if (!imagePreview || detection.length === 0) return null;

  //   return detection.map((item, idx) => {
  //     const box = item.boundingBox;
  //     return (
  //       <div
  //         key={idx}
  //         className="absolute border-2 border-red-500"
  //         style={{
  //           left: `${box.left * 100}%`,
  //           top: `${box.top * 100}%`,
  //           width: `${box.width * 100}%`,
  //           height: `${box.height * 100}%`,
  //         }}
  //       >
  //         <span className="absolute bg-red-500 text-white text-xs px-1 -top-5 left-0">
  //           {item.tagName} ({(item.probability * 100).toFixed(1)}%)
  //         </span>
  //       </div>
  //     );
  //   });
  // };

  const renderBoundingBoxes = () => {
    if (!imagePreview || detection.length === 0) return null;

    const item = detection[0]; // get only the first detection
    const box = item.boundingBox;

    return (
      <div
        className="absolute border-2 border-red-500"
        style={{
          left: `${box.left * 100}%`,
          top: `${box.top * 100}%`,
          width: `${box.width * 100}%`,
          height: `${box.height * 100}%`,
        }}
      >
        <span className="absolute bg-red-500/60 text-white text-xs px-1 -top-9 left-0">
          {item.tagName} ({(item.probability * 100).toFixed(1)}%)
        </span>
      </div>
    );
  };
  return (
    <div
      // style={{ backgroundImage: `url(/assets/bg2.jpg)` }}
      className="min-h-screen bg-gradient-to-tl from-slate-900 via-indigo-900 to-blue-800 bg-cover bg-center flex  justify-center px-4 py-8"
    >
      {/* <div className="p-1 bg-blue-200/30 w-22 mt-3 rounded-full backdrop-blur-xs mb-3">
        <img src={logo} className="h-20 w-20" alt="Logo" />
      </div> */}
      <div className="h-auto w-full max-w-md bg-blue-100/40 rounded-3xl bg-clip-padding backdrop-blur-xs border border-gray-100 flex flex-col items-center p-6 ">
        <h1 className="text-3xl font-bold mb-6 text-neutral-200">Vehicle Identifier</h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          {/* <button
            onClick={() => setActiveTab("file")}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === "file" ? "bg-blue-600 text-white" : "bg-white text-gray-700 border border-gray-300"
            }`}
          >
            Upload File
          </button> */}
          {/* <button
            onClick={() => setActiveTab("url")}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === "url" ? "bg-blue-600 text-white" : "bg-white text-gray-700 border border-gray-300"
            }`}
          >
            Image URL
          </button> */}
        </div>

        {/* Card */}
        <div className="bg-white/50 shadow-lg rounded-xl p-6 w-full max-w-md">
          {activeTab === "file" && (
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="block w-full text-sm text-gray-500
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100"
              />
              <button
                onClick={handleFilePredict}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
              >
                {loading ? "Identifying..." : "Identify Vehicle Type"}
              </button>
            </div>
          )}

          {activeTab === "url" && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="border border-gray-300 rounded-lg w-full p-2"
              />
              <button
                onClick={handleUrlPredict}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
              >
                {loading ? "Predicting..." : "Predict from URL"}
              </button>
            </div>
          )}
        </div>

        {/* Image with bounding boxes */}
        {imagePreview && (
          <div className="relative mt-6 border rounded-lg overflow-hidden inline-block">
            <img src={imagePreview} alt="Preview" className="w-full" />
            {renderBoundingBoxes()}
          </div>
        )}

        {/* Classification result */}
        {classification && (
          <div className="mt-10 bg-white/50 shadow-md rounded-xl p-4 w-full max-w-md text-center">
            <h3 className="text-2xl font-bold text-gray-800">{classification.tagName}</h3>
            <p className="text-gray-600">Accuracy: {(classification.probability * 100).toFixed(2)}%</p>
            <p className="text-gray-600">
              Make: <span className="text-gray-800 font-bold">{detection[0].tagName}</span> ({(detection[0].probability * 100).toFixed(2)}%){" "}
            </p>
          </div>
        )}

        {/* Object Detection first result */}
        {/* {detection.length > 0 && (
          <div className="mt-4 bg-white/50 shadow-md rounded-xl p-4 w-full max-w-md text-center">
            <h3 className="text-lg font-bold text-gray-800">{detection[0].tagName}</h3>
            <p className="text-gray-600">Confidence: {(detection[0].probability * 100).toFixed(2)}%</p>
          </div>
        )} */}
      </div>
    </div>
  );
}
