import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';

interface OnboardingTutorialProps {
  onComplete: () => void;
}

const steps = [
  {
    title: 'Welcome to Emotion Diary',
    description: 'Track your emotions and gain insights into your emotional well-being.',
  },
  {
    title: 'Record Your Emotions',
    description: 'Select an emotion and write about your day to keep track of your feelings.',
  },
  {
    title: 'Activate Emotion Powers',
    description: 'Use your emotion powers to boost your mood and earn points.',
  },
  {
    title: 'Share with Friends',
    description: 'Connect with friends and share your emotional journey.',
  },
];

export function OnboardingTutorial({ onComplete }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <AnimatePresence>
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="bg-white rounded-lg p-8 max-w-md"
        >
          <h2 className="text-2xl font-bold mb-4">{steps[currentStep].title}</h2>
          <p className="mb-6">{steps[currentStep].description}</p>
          <Button onClick={nextStep}>
            {currentStep < steps.length - 1 ? 'Next' : 'Get Started'}
          </Button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}