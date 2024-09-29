export interface Emotion {
  color: string;
  name: string;
  points: number;
  power: string;
  sound: string;
}

export const emotions: Emotion[] = [
  { color: '#4169E1', name: 'Sadness', points: 5, power: 'Empathy boost', sound: '/sounds/sadness.mp3' },
  { color: '#FF4500', name: 'Anger', points: 5, power: 'Energy burst', sound: '/sounds/anger.mp3' },
  { color: '#006400', name: 'Fear', points: 5, power: 'Heightened awareness', sound: '/sounds/fear.mp3' },
  { color: '#8A2BE2', name: 'Surprise', points: 8, power: 'Quick reflexes', sound: '/sounds/surprise.mp3' },
  { color: '#8B0000', name: 'Disgust', points: 5, power: 'Protective shield', sound: '/sounds/disgust.mp3' },
  { color: '#87CEEB', name: 'Calm', points: 8, power: 'Healing aura', sound: '/sounds/calm.mp3' },
  { color: '#FFA500', name: 'Excited', points: 10, power: 'Speed boost', sound: '/sounds/excited.mp3' },
  { color: '#90EE90', name: 'Curious', points: 7, power: 'Discover secrets', sound: '/sounds/curious.mp3' },
];