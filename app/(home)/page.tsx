import { Button } from "@/components/ui/button";
import { Vortex } from "@/components/ui/vortex";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-[calc(100%-0rem)] mx-auto rounded-md  h-screen overflow-hidden">
      <Vortex
        backgroundColor="black"
        rangeY={800}
        particleCount={500}
        baseHue={120}
        className="flex items-center flex-col justify-center px-2 md:px-10  py-4 w-full h-full"
      >
        <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
          AI-Powered <br /> Cancerous Cells Detection
        </h2>
        <p className="text-white text-sm md:text-xl max-w-xl mt-6 text-center">
          Upload a medical image to analyze for potential cancerous cells using
          our AI-powered model. This tool is for informational purposes only and
          should not be used for medical diagnosis.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <Link href="/detection">
            <Button variant="outline">Try Now</Button>
          </Link>
        </div>
      </Vortex>
    </div>
  );
}
