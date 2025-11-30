// Fallback voice utility for browsers without speech recognition
export class TextToSpeech {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.loadVoices();
  }

  loadVoices() {
    this.voices = this.synth.getVoices();
    
    // Some browsers load voices asynchronously
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => {
        this.voices = this.synth.getVoices();
      };
    }
  }

  speak(text, rate = 0.8, pitch = 1) {
    if (this.synth.speaking) {
      this.synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    
    // Prefer female voice if available
    const femaleVoice = this.voices.find(voice => 
      voice.name.includes('Female') || voice.name.includes('woman') || voice.name.includes('Google UK English Female')
    );
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    this.synth.speak(utterance);
  }

  stop() {
    this.synth.cancel();
  }
}

// Simple text commands as fallback
export const processTextCommand = (text, onTaskAdd) => {
  const commands = {
    'water': { type: 'irrigation', task: 'Water plants' },
    'fertilize': { type: 'fertilizer', task: 'Apply fertilizer' },
    'spray': { type: 'pestcontrol', task: 'Spray for pests' },
    'harvest': { type: 'harvest', task: 'Harvest crops' },
    'weed': { type: 'general', task: 'Weed the garden' }
  };

  const lowerText = text.toLowerCase();
  
  for (const [keyword, action] of Object.entries(commands)) {
    if (lowerText.includes(keyword)) {
      onTaskAdd(action.task, action.type);
      return true;
    }
  }
  
  return false;
};