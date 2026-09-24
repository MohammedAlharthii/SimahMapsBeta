"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronRight, UploadCloud, MapPin } from "lucide-react";

const steps = [
  { id: "basic", title: "Basic Info" },
  { id: "details", title: "Details" },
  { id: "location", title: "Location" },
  { id: "media", title: "Images" },
  { id: "review", title: "Review" }
];

const schema = z.object({
  titleEn: z.string().min(5),
  titleAr: z.string().min(5),
  type: z.string(),
  price: z.number().min(1),
  // Add more validation fields...
});

export default function AddPropertyPage() {
  const [currentStep, setCurrentStep] = useState(0);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      titleEn: "",
      titleAr: "",
      type: "VILLA",
      price: 0,
    }
  });

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const onSubmit = (data: any) => {
    console.log("Submit", data);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Add New Property</h1>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between relative mb-12">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted -z-10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center bg-background px-2 gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-medium transition-colors
              ${index < currentStep ? 'bg-primary border-primary text-primary-foreground' : 
                index === currentStep ? 'border-primary text-primary' : 'border-muted text-muted-foreground'}`}>
              {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
            </div>
            <span className={`text-xs font-medium ${index <= currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="bg-card border rounded-lg p-6 shadow-sm min-h-[400px]">
        {currentStep === 0 && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title (English)</label>
                <input {...register("titleEn")} className="w-full border rounded-md px-3 py-2 text-sm" placeholder="e.g. Modern Villa" />
              </div>
              <div className="space-y-2 text-right" dir="rtl">
                <label className="text-sm font-medium block">العنوان (عربي)</label>
                <input {...register("titleAr")} className="w-full border rounded-md px-3 py-2 text-sm text-right" placeholder="مثال: فيلا حديثة" />
              </div>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="text-xl font-semibold mb-6">Property Details</h2>
            <div className="grid grid-cols-3 gap-4">
               {/* Details form mock */}
               <div className="space-y-2">
                <label className="text-sm font-medium">Bedrooms</label>
                <input type="number" className="w-full border rounded-md px-3 py-2 text-sm" />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="text-xl font-semibold mb-6">Location</h2>
            <div className="h-64 bg-muted rounded-md border flex items-center justify-center flex-col gap-2">
              <MapPin className="w-8 h-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Map Placeholder</p>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="text-xl font-semibold mb-6">Images & Documents</h2>
            <div className="border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center text-center hover:bg-muted/50 cursor-pointer transition-colors">
              <UploadCloud className="w-10 h-10 text-muted-foreground mb-4" />
              <h3 className="font-medium text-lg">Click or drag images here</h3>
              <p className="text-sm text-muted-foreground mt-1">Supports JPG, PNG up to 10MB</p>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="text-xl font-semibold mb-6">Review & Publish</h2>
            <p className="text-sm text-muted-foreground">Review your property details before publishing.</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-muted disabled:opacity-50"
        >
          Previous
        </button>
        {currentStep < steps.length - 1 ? (
          <button
            onClick={nextStep}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium flex items-center gap-2 hover:bg-primary/90"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit(onSubmit)}
            className="px-6 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
          >
            Publish Property
          </button>
        )}
      </div>
    </div>
  );
}
