"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import { IconChevronLeft } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

function Detection() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageUpload = (files: File[]) => {
    // const file = event.target.files?.[0];
    if (files) {
      setImage(files[0]);
      setPreview(URL.createObjectURL(files[0]));
    }
  };

  return (
    <div className="flex flex-col justify-evenly items-center min-h-screen">
      <div className="flex w-full px-5">
        <Link href="/">
          <Button className="align-baseline" variant="outline">
            <IconChevronLeft />
          </Button>
        </Link>
        <h1 className="text-4xl font-bold flex-1 text-center">
          Prototype for cancer cell detection using ML Model
        </h1>
      </div>
      <div className="flex flex-col items-center justify-center px-6 ">
        <Card className="">
          <CardContent className="space-y-6">
            <h1 className="text-2xl font-bold ">Upload Medical Image</h1>
            <p className="">
              Upload an image (JPG, PNG, or DICOM) for AI analysis.
            </p>

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
                <div className="flex flex-col items-center ">
                  <FileUpload onChange={handleImageUpload} />
                </div>
              )}
            </div>

            <Button>Upload & Detect</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Detection;
