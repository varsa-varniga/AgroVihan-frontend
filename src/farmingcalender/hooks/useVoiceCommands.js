import { useState, useEffect, useRef } from 'react';

const useVoiceCommands = (onTaskAdd) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check if speech recognition is supported
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition not supported in your browser. Try Chrome or Edge.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US'; // Fixed the typo here
    recognitionRef.current.maxAlternatives = 1;

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setError('');
      setTranscript('Listening...');
    };

    recognitionRef.current.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      
      // Only process when speech is final
      if (event.results[0].isFinal) {
        processVoiceCommand(text, onTaskAdd);
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.log('Speech recognition error:', event.error);
      
      switch (event.error) {
        case 'no-speech':
          setError('No speech detected. Please try again.');
          break;
        case 'audio-capture':
          setError('No microphone found. Please check your microphone.');
          break;
        case 'not-allowed':
          setError('Microphone permission denied. Please allow microphone access.');
          break;
        case 'network':
          setError('Network error. Please check your internet connection.');
          break;
        default:
          setError(`Error: ${event.error}. Please try again.`);
      }
      
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTaskAdd]);

  const startListening = () => {
    setError('');
    setTranscript('');
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.log('Error starting recognition:', error);
        setError('Failed to start voice recognition. Please refresh and try again.');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening
  };
};

const processVoiceCommand = (text, onTaskAdd) => {
  const lowerText = text.toLowerCase();
  
  // Enhanced voice command processing with Tamil support
  const tamilCommands = {
    'நீர்': { type: 'irrigation', task: 'Water plants' },
    'உரம்': { type: 'fertilizer', task: 'Apply fertilizer' },
    'பூச்சி': { type: 'pestcontrol', task: 'Spray for pests' },
    'அறுவடை': { type: 'harvest', task: 'Harvest crops' },
    'களை': { type: 'general', task: 'Remove weeds' }
  };

  // Check Tamil commands first
  for (const [tamilWord, action] of Object.entries(tamilCommands)) {
    if (lowerText.includes(tamilWord)) {
      onTaskAdd(action.task, action.type);
      return;
    }
  }
  
  // English command processing
  if (lowerText.includes('add') || lowerText.includes('create') || lowerText.includes('new')) {
    const taskText = text.replace(/add|create|new|task/gi, '').trim();
    if (taskText) {
      let type = 'general';
      
      if (lowerText.includes('water') || lowerText.includes('irrigation') || lowerText.includes('irrigate')) {
        type = 'irrigation';
      } else if (lowerText.includes('fertilizer') || lowerText.includes('fertilize') || lowerText.includes('compost')) {
        type = 'fertilizer';
      } else if (lowerText.includes('pest') || lowerText.includes('spray') || lowerText.includes('insect')) {
        type = 'pestcontrol';
      } else if (lowerText.includes('harvest') || lowerText.includes('pick') || lowerText.includes('collect')) {
        type = 'harvest';
      }
      
      onTaskAdd(taskText, type);
    }
  } else {
    // Default - treat entire speech as task
    onTaskAdd(text, 'general');
  }
};

export default useVoiceCommands;