import React from 'react';
import dynamic from 'next/dynamic';

const DynamicEmotionDiary = dynamic(() => import('../components/EmotionDiary'), { ssr: false });

export default function Home() {
  return <DynamicEmotionDiary />;
}