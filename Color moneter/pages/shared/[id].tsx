import React from 'react';
import dynamic from 'next/dynamic';

const DynamicSharedDiary = dynamic(() => import('../../app/components/SharedDiary'), { ssr: false });

export default function SharedDiaryPage() {
  return <DynamicSharedDiary />;
}