"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { LoaderCircle } from "lucide-react";

export default function SubmitButton() {
  const { pending } = useFormStatus();

  console.log(pending);
  return (
    <Button className="relative w-full font-semibold">
      <span className={pending ? "text-transparent" : ""}>Submit</span>
      {pending && (
        <span className="absolute flex items-center justify-center w-full h-full text-gray-400">
          <LoaderCircle className="animate-spin h-4 w-4" />
        </span>
      )}
    </Button>
  );
}
