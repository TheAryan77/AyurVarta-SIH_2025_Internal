export const mockQuizQuestions = [
  {
    questionText: 'Determining Your Constitution',
    questionType: 'dosha-selection',
    options: [
  { text: 'Pitta', icon: 'pitta.png', color: 'var(--secondary-orange)' },
  { text: 'Vata', icon: 'vitta.png', color: 'var(--accent-yellow)' },
  { text: 'Kapha', icon: 'kapha.png', color: 'var(--accent-teal)' },
    ]
  },
  {
    questionText: 'Rank the body type that best describes you.',
    questionType: 'body-type-ranking',
    options: [
      { text: 'Thin build', description: 'Light frame, find it hard to gain weight.', image: 'thin-silhouette.png' },
      { text: 'Medium build', description: 'Athletic, good muscle tone, gain/lose weight easily.', image: 'medium-silhouette.png' },
      { text: 'Big build', description: 'Larger frame, tend to gain weight easily.', image: 'big-silhouette.png' },
    ]
  },
  {
    questionText: 'Which characteristics best describe your temperament?',
    questionType: 'characteristic-checkbox',
    options: [
      { title: 'Passionate & Intense', bullets: ['Focused', 'Driven', 'Assertive'] },
      { title: 'Creative & Energetic', bullets: ['Enthusiastic', 'Quick-minded', 'Lively'] },
      { title: 'Calm & Methodical', bullets: ['Patient', 'Supportive', 'Easy-going'] },
      { title: 'Anxious & Restless', bullets: ['Worry-prone', 'Find it hard to relax', 'Overthinker'] },
    ]
  },
  {
    questionText: 'How is your typical digestion?',
    questionType: 'radio-select',
    options: [
      { text: 'Strong and fast, I get hungry often.' },
      { text: 'Irregular, sometimes strong, sometimes weak.' },
      { text: 'Slow and steady, I can miss meals easily.' },
    ]
  }
];
