"use client";
import {Suspense, useState } from "react";
import InstructorLayout from "../../Components/InstructorLayout";
import  CourseDetails  from "./CourseDetails";
import CourseStructure from "./CourseStructure";
import CourseContent from "./CourseContent";
import PricingReview from "./PricingReview";

const steps = [
  "Course Details",
  "Course Structure",
  "Course Content",
  "Pricing & Review",
];

const AddCoursePage = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <InstructorLayout>
      <div className="p-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-medium pl-5">Add New Course</h1>

          {/* Stepper */}
          <div className="flex items-center justify-between w-1/2">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center flex-1 relative"
              >
                {/* Connector Line (before current step) */}
                {index > 0 && (
                  <div
                    className={`absolute top-2.5 xl:-left-[7.5rem] lg:-left-[0.5rem] md:-left-[0.5rem] sm:-left-[0.5rem] w-full h-[1px]  ${currentStep >= index ? "bg-[#1B09A2]" : "bg-gray-300"
                      }`}
                  ></div>
                )}

                {/* Step Circle */}
                <div
                  className={`relative z-10 flex items-center justify-center w-5 h-5 rounded-full text-white font-bold
            ${currentStep >= index ? "bg-[#1B09A2]" : "bg-gray-300"}
        `}
                >
                  {index + 1}
                </div>

                {/* Step Name */}
                <p
                  className={`mt-2 text-sm text-center ${currentStep >= index
                      ? "text-[#1B09A2] font-bold"
                      : "text-gray-500"
                    }`}
                >
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

      

        {/* Step Components */}
        <div className="mt-6 p-4">
          {currentStep === 0 && (
            <Suspense fallback={<div>Loading structure...</div>}>
            <CourseDetails currentStep={currentStep} nextStep={nextStep} prevStep={prevStep} />
            </Suspense>
          )}
          {currentStep === 1 && (
            <Suspense fallback={<div>Loading structure...</div>}>
            <CourseStructure currentStep={currentStep} nextStep={nextStep} prevStep={prevStep} />
            </Suspense>
          )}
          {currentStep === 2 && (
            <Suspense fallback={<div>Loading structure...</div>}>
            <CourseContent  nextStep={nextStep} />
            </Suspense>
          )}
          {currentStep === 3 && (
            <Suspense fallback={<div>Loading structure...</div>}>
            <PricingReview  />
            </Suspense>
          )}
        </div>
      </div>
    </InstructorLayout>
  );
};

export default AddCoursePage;

