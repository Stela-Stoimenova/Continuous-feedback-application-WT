// emoticon configuration
// defines the four emotion types students can use for feedback
// each emotion has: value (1-4), label, emoji, and color schemes
// emotions: Happy, Bored, Surprised, Confused

export const EMOTIONS = [
  { 
    type: 'happy',
    label: 'Happy',
    value: 1,
    emoji: '😊',
    color: 'bg-green-100 hover:bg-green-200 border-green-300',
    activeColor: 'bg-green-300 border-green-500'
  },
  { 
    type: 'bored',
    label: 'Bored',
    value: 2,
    emoji: '😴',
    color: 'bg-gray-100 hover:bg-gray-200 border-gray-300',
    activeColor: 'bg-gray-300 border-gray-500'
  },
  { 
    type: 'surprised',
    label: 'Surprised',
    value: 3,
    emoji: '😲',
    color: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300',
    activeColor: 'bg-yellow-300 border-yellow-500'
  },
  { 
    type: 'confused',
    label: 'Confused',
    value: 4,
    emoji: '😕',
    color: 'bg-purple-100 hover:bg-purple-200 border-purple-300',
    activeColor: 'bg-purple-300 border-purple-500'
  }
]

// get emotion configuration by its numeric value (1-4)
// returns the emotion object with all its properties
export function getEmotionById(value) {
  return EMOTIONS.find(e => e.value === value) || EMOTIONS[0]
}

// get just the display label for an emotion value
export function getEmotionLabel(value) {
  return getEmotionById(value).label
}

// get just the emoji icon for an emotion value  
export function getEmotionEmoji(value) {
  return getEmotionById(value).emoji
}




