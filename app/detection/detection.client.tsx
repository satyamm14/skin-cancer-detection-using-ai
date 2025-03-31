"use client";

import { useReducer, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import { Progress } from "@/components/ui/progress";
import { IconChevronLeft } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

// Reducer function for managing complex state
const initialState = {
  image: null,
  preview: null,
  status: "",
  progress: 0,
  loading: false,
  finalPred: null,
  confidence: null,
  effProbs: null,
  lgbmProbs: null,
};

function detectionReducer(state: typeof initialState, action: any) {
  switch (action.type) {
    case "SET_IMAGE":
      return {
        ...state,
        image: action.payload,
        preview: URL.createObjectURL(action.payload),
        finalPred: null,
        confidence: null,
        effProbs: null,
        lgbmProbs: null,
      };
    case "SET_STATUS":
      return { ...state, status: action.payload };
    case "SET_PROGRESS":
      return { ...state, progress: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_RESULTS":
      return {
        ...state,
        finalPred: action.payload.finalPred,
        confidence: action.payload.confidence,
        effProbs: action.payload.effProbs,
        lgbmProbs: action.payload.lgbmProbs,
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

function Detection() {
  const [state, dispatch] = useReducer(detectionReducer, initialState);

  const handleImageUpload = useCallback((files: File[]) => {
    if (files.length > 0) {
      dispatch({ type: "SET_IMAGE", payload: files[0] });
    }
  }, []);

  const handleReset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const handleAnalyze = async () => {
    if (!state.image) return;

    dispatch({ type: "SET_STATUS", payload: "Uploading image..." });
    dispatch({ type: "SET_PROGRESS", payload: 25 });
    dispatch({ type: "SET_LOADING", payload: true });

    const formData = new FormData();
    formData.append("file", state.image);

    try {
      const response = await fetch("http://localhost:8000/predict/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to get response from server");
      }

      dispatch({ type: "SET_STATUS", payload: "Analyzing image..." });
      dispatch({ type: "SET_PROGRESS", payload: 50 });

      const data = await response.json();

      dispatch({
        type: "SET_RESULTS",
        payload: {
          finalPred: data.final_pred,
          confidence: data.final_probs[1],
          effProbs: data.eff_probs,
          lgbmProbs: data.lgbm_probs,
        },
      });
      dispatch({ type: "SET_STATUS", payload: "Detection complete" });
      dispatch({ type: "SET_PROGRESS", payload: 100 });
    } catch (error: any) {
      dispatch({ type: "SET_STATUS", payload: "Error: " + error.message });
      dispatch({ type: "SET_PROGRESS", payload: 0 });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const {
    image,
    preview,
    status,
    progress,
    loading,
    finalPred,
    confidence,
    effProbs,
    lgbmProbs,
  } = state;

  return (
    <div className="flex flex-col justify-evenly items-center min-h-screen">
      {/* Back Button and Header */}
      <div className="flex w-full px-5 items-center">
        <Link href="/">
          <Button className="align-baseline" variant="outline">
            <IconChevronLeft />
          </Button>
        </Link>
        <h1 className="text-4xl font-bold flex-1 text-center">
          Prototype for Cancer Cell Detection using ML Model
        </h1>
      </div>

      <div className="flex flex-row gap-6">
        {/* Upload Section */}
        <div className="mt-6 w-full flex flex-col items-center">
          <Card className="w-full max-w-lg p-6 text-center shadow-lg">
            <CardContent className="space-y-6">
              <h1 className="text-2xl font-bold">Upload Medical Image</h1>
              <p>Upload an image (JPG, PNG, or DICOM) for AI analysis.</p>

              <div className="w-full h-72 flex items-center justify-center rounded-lg border-dashed border-2 cursor-pointer">
                {preview ? (
                  <Image
                    src={preview}
                    alt="Uploaded Preview"
                    className="w-full h-full object-cover rounded-lg"
                    width={320}
                    height={320}
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <FileUpload onChange={handleImageUpload} />
                  </div>
                )}
              </div>

              {progress > 0 && <Progress value={progress} />}
              <p className="text-lg font-semibold">{status}</p>

              <Button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Processing..." : "Upload & Detect"}
              </Button>

              {/* Reset Button */}
              {preview && (
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full mt-2"
                >
                  🔄 Reset & Upload New Image
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
        {/* Detection Result */}
        {finalPred !== null && (
          <div className="mt-6 w-full flex flex-col items-center">
            <Card className="w-full max-w-lg p-6 text-center shadow-lg">
              <h2 className="text-2xl font-bold">Detection Result</h2>

              <div className="flex flex-col items-center mt-4">
                {finalPred === 1 ? (
                  <div className="bg-red-100 text-red-700 px-4 py-3 rounded-md w-full">
                    <h3 className="text-xl font-semibold">
                      ⚠️ Cancer Detected
                    </h3>
                    <p className="mt-2">
                      The model detected potential **malignant cells**. Please
                      consult a doctor for further analysis.
                    </p>
                  </div>
                ) : (
                  <div className="bg-green-100 text-green-700 px-4 py-3 rounded-md w-full">
                    <h3 className="text-xl font-semibold">
                      ✅ No Cancer Detected
                    </h3>
                    <p className="mt-2">
                      No malignant cells detected in the image. However, regular
                      checkups are recommended.
                    </p>
                  </div>
                )}
              </div>

              {/* Confidence Score */}
              {confidence !== null && (
                <div className="mt-4 text-lg">
                  <strong>Cancer Confidence Score:</strong>
                  <span className="ml-2 font-semibold text-blue-600">
                    {(confidence * 100).toFixed(2)}%
                  </span>
                </div>
              )}

              {/* Optional: Show Model Probabilities */}
              {effProbs && lgbmProbs && (
                <div className="mt-4">
                  <i>
                    <u>Stats for nerds: </u>
                  </i>{" "}
                  <h3 className="text-lg font-semibold">Model Probabilities</h3>
                  <p>
                    EfficientNet:{" "}
                    {effProbs.map((p) => p.toFixed(4)).join(" | ")}
                  </p>
                  <p>
                    LightGBM: {lgbmProbs.map((p) => p.toFixed(4)).join(" | ")}
                  </p>
                </div>
              )}

              <Button variant="outline" className="mt-4" onClick={handleReset}>
                🔄 Upload Another Image
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default Detection;
