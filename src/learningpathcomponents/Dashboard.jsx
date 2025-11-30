import React, { useState, useEffect } from "react";
import {
  LogOut,
  Coins,
  Play,
  ChevronRight,
  BookOpen,
  Trophy,
  CheckCircle,
  Award,
  Lock,
  Star,
  RefreshCw,
} from "lucide-react";
import DatabaseService from "../learningpathservice/database";

// Move courseData outside the component or to the top
const courseData = {
  tamil: {
    modules: [
      {
        id: 1,
        title: "மண்ணைப் புரிந்துகொள்ளுதல்",
        description: "உங்கள் விவசாயப் பயணத்தை மண் அறிவுடன் தொடங்குங்கள்",
        tokens: 100,
        videos: [
          {
            title: "மண் வகைகள் மற்றும் பண்புகள்",
            youtubeId: "9dTwr6R4-4Q",
            duration: "8:45",
          },
          {
            title: "மண் ஆரோக்கியம் மற்றும் pH மதிப்பு",
            youtubeId: "cPxPGxKPaCs",
            duration: "7:30",
          },
          {
            title: "மண் ஈரப்பதம் மற்றும் நீர் தக்கவைப்பு",
            youtubeId: "Y3tF_u-uNAA",
            duration: "9:15",
          },
          {
            title: "மண் வளம் மேம்பாடு",
            youtubeId: "m5V_IaF6YQo",
            duration: "10:20",
          },
        ],
        quiz: [
          {
            question: "விவசாயத்திற்கு ஏற்ற மண் எது?",
            options: ["மண்ணீர் மண்", "களிமண்", "கரிசல் மண்", "மணல் மண்"],
            correct: 2,
          },
          {
            question: "ஆரோக்கியமான மண்ணின் pH மதிப்பு என்ன?",
            options: ["3-4", "5-6", "6.5-7.5", "8-9"],
            correct: 2,
          },
          {
            question: "மண்ணில் கரிமப் பொருட்கள் ஏன் முக்கியம்?",
            options: [
              "நிறத்திற்காக",
              "ஊட்டச்சத்துக்களுக்காக",
              "எடைக்காக",
              "வெப்பத்திற்காக",
            ],
            correct: 1,
          },
          {
            question: "மண் ஈரப்பதத்தை எவ்வாறு சோதிக்கலாம்?",
            options: ["சுவைத்து", "கையால் பிசைந்து", "மணத்தால்", "நிறத்தால்"],
            correct: 1,
          },
          {
            question: "எந்த மண் நீரை அதிகம் தக்கவைக்கும்?",
            options: ["மணல் மண்", "கரிசல் மண்", "களிமண்", "பாறை மண்"],
            correct: 2,
          },
        ],
      },
      {
        id: 2,
        title: "சரியான பயிரைத் தேர்வு செய்தல்",
        description: "உங்கள் மண் மற்றும் காலநிலைக்கு ஏற்ற பயிரை கண்டறியுங்கள்",
        tokens: 150,
        videos: [
          {
            title: "காலநிலை மற்றும் பயிர் தேர்வு",
            youtubeId: "FsXFbJxG_Eg",
            duration: "10:20",
          },
          {
            title: "பருவகால பயிர் திட்டமிடல்",
            youtubeId: "jT5oAqb0i1s",
            duration: "8:50",
          },
          {
            title: "லாபகரமான பயிர்கள் மற்றும் சந்தை தேவை",
            youtubeId: "ZMrCD-0Ux4o",
            duration: "11:15",
          },
          {
            title: "கலப்பு பயிர் முறைகள்",
            youtubeId: "nHwpw0ZG9w8",
            duration: "9:40",
          },
        ],
        quiz: [
          {
            question: "பருவமழை காலத்தில் ஏற்ற பயிர் எது?",
            options: ["கோதுமை", "நெல்", "கடலை", "சோளம்"],
            correct: 1,
          },
          {
            question: "குறைந்த நீர் தேவையுள்ள பயிர்?",
            options: ["நெல்", "கரும்பு", "தினை", "வாழை"],
            correct: 2,
          },
          {
            question: "கலப்பு பயிரின் நன்மை என்ன?",
            options: [
              "அதிக இடம்",
              "குறைந்த இடம்",
              "அபாய மேலாண்மை",
              "விலை அதிகம்",
            ],
            correct: 2,
          },
          {
            question: "தமிழ்நாட்டில் அதிக லாபம் தரும் காய்கறி?",
            options: ["உருளைக்கிழங்கு", "தக்காளி", "வெங்காயம்", "கேரட்"],
            correct: 1,
          },
          {
            question: "பயிர் தேர்வில் முக்கிய காரணி?",
            options: ["நிறம்", "பெயர்", "மண் வகை", "பிராண்ட்"],
            correct: 2,
          },
        ],
      },
      {
        id: 3,
        title: "நீர் மற்றும் நீர்ப்பாசன அடிப்படைகள்",
        description: "திறமையான நீர் மேலாண்மை முறைகளை கற்றுக்கொள்ளுங்கள்",
        tokens: 120,
        videos: [
          {
            title: "நீர்ப்பாசன முறைகள் மற்றும் வகைகள்",
            youtubeId: "mWzZmM-lkAY",
            duration: "9:30",
          },
          {
            title: "சொட்டு நீர்ப்பாசன தொழில்நுட்பம்",
            youtubeId: "m59bwJgKKzE",
            duration: "10:45",
          },
          {
            title: "நீர் சேமிப்பு நுட்பங்கள்",
            youtubeId: "Kc-zXz8JKjg",
            duration: "8:20",
          },
          {
            title: "மழைநீர் சேகரிப்பு முறைகள்",
            youtubeId: "bB7Y3E4Cj1s",
            duration: "11:10",
          },
        ],
        quiz: [
          {
            question: "நீர் சேமிப்புக்கு சிறந்த முறை?",
            options: ["வெள்ளப்பாசனம்", "சொட்டு நீர்", "தெளிப்பு", "கால்வாய்"],
            correct: 1,
          },
          {
            question: "எப்போது பயிருக்கு நீர் தேவை?",
            options: ["எப்போதும்", "மண் உலரும்போது", "மாலையில்", "வெயிலில்"],
            correct: 1,
          },
          {
            question: "சொட்டு நீரின் நன்மை?",
            options: [
              "அதிக நீர்",
              "நீர் சேமிப்பு",
              "விலை குறைவு",
              "பராமரிப்பு இல்லை",
            ],
            correct: 1,
          },
          {
            question: "மழை நீர் சேகரிப்பு ஏன் முக்கியம்?",
            options: [
              "சுத்தம்",
              "இலவசம்",
              "நிலத்தடி நீர் மேம்பாடு",
              "குளிர்ச்சி",
            ],
            correct: 2,
          },
          {
            question: "நீர்ப்பாசனத்திற்கு ஏற்ற நேரம்?",
            options: ["நண்பகல்", "காலை/மாலை", "மதியம்", "எப்போதும்"],
            correct: 1,
          },
        ],
      },
      {
        id: 4,
        title: "உரமிடுதல் மற்றும் ஊட்டச்சத்து மேலாண்மை",
        description: "பயிர்களுக்கு சரியான ஊட்டச்சத்து வழங்கும் முறைகள்",
        tokens: 130,
        videos: [
          {
            title: "அடிப்படை தாவர ஊட்டச்சத்துக்கள்",
            youtubeId: "9dTwr6R4-4Q",
            duration: "8:30",
          },
          {
            title: "கரிம உரங்கள் மற்றும் தயாரிப்பு",
            youtubeId: "cPxPGxKPaCs",
            duration: "12:15",
          },
          {
            title: "இரசாயன உரங்களின் பாதுகாப்பான பயன்பாடு",
            youtubeId: "Y3tF_u-uNAA",
            duration: "9:45",
          },
          {
            title: "மண் வளம் சோதனை மற்றும் மேலாண்மை",
            youtubeId: "m5V_IaF6YQo",
            duration: "10:20",
          },
        ],
        quiz: [
          {
            question: "தாவர வளர்ச்சிக்கு முக்கிய ஊட்டச்சத்து?",
            options: ["நைட்ரஜன்", "கார்பன்", "ஹைட்ரஜன்", "ஆக்ஸிஜன்"],
            correct: 0,
          },
          {
            question: "கரிம உரத்தின் நன்மை என்ன?",
            options: [
              "விரைவு விளைவு",
              "மண் ஆரோக்கியம்",
              "குறைந்த விலை",
              "அதிக உற்பத்தி",
            ],
            correct: 1,
          },
          {
            question: "NPK என்றால் என்ன?",
            options: [
              "நைட்ரஜன், பாஸ்பரஸ், பொட்டாசியம்",
              "நைட்ரஜன், பாஸ்பரஸ், கார்பன்",
              "நைட்ரஜன், பொட்டாசியம், கால்சியம்",
              "நைட்ரஜன், பாஸ்பரஸ், கால்சியம்",
            ],
            correct: 0,
          },
          {
            question: "மண் சோதனை செய்வது ஏன் முக்கியம்?",
            options: [
              "நிறம் பார்க்க",
              "ஊட்டச்சத்து தேவை அறிய",
              "விலை குறைக்க",
              "நேரம் சேமிக்க",
            ],
            correct: 1,
          },
          {
            question: "மிகவும் பாதுகாப்பான உரம் எது?",
            options: [
              "இரசாயன உரம்",
              "கரிம உரம்",
              "திரவ உரம்",
              "வேதியியல் உரம்",
            ],
            correct: 1,
          },
        ],
      },
      {
        id: 5,
        title: "பூச்சி மற்றும் நோய் மேலாண்மை",
        description:
          "இயற்கை முறையில் பூச்சிகள் மற்றும் நோய்களை கட்டுப்படுத்துதல்",
        tokens: 140,
        videos: [
          {
            title: "பொதுவான பயிர் நோய்கள் மற்றும் அறிகுறிகள்",
            youtubeId: "FsXFbJxG_Eg",
            duration: "11:20",
          },
          {
            title: "இயற்கை பூச்சி மருந்துகள் தயாரிப்பு",
            youtubeId: "jT5oAqb0i1s",
            duration: "13:45",
          },
          {
            title: "உயிரியல் கட்டுப்பாடு முறைகள்",
            youtubeId: "ZMrCD-0Ux4o",
            duration: "10:30",
          },
          {
            title: "தடுப்பு மருந்துகள் மற்றும் பயன்பாடு",
            youtubeId: "nHwpw0ZG9w8",
            duration: "9:15",
          },
        ],
        quiz: [
          {
            question: "இயற்கை பூச்சி மருந்துக்கு உதாரணம்?",
            options: ["நீம் எண்ணெய்", "DDT", "க்ளோர்பைரிஃபாஸ்", "கார்பரில்"],
            correct: 0,
          },
          {
            question: "உயிரியல் கட்டுப்பாட்டு முறை என்றால் என்ன?",
            options: [
              "இரசாயன பயன்பாடு",
              "இயற்கை எதிரிகளை பயன்படுத்துதல்",
              "இயந்திர கட்டுப்பாடு",
              "கையால் அகற்றுதல்",
            ],
            correct: 1,
          },
          {
            question: "தடுப்பு மருந்து பயன்படுத்த வேண்டிய நேரம்?",
            options: [
              "நோய் வந்த பின்",
              "நோய் வருவதற்கு முன்",
              "எப்போதும்",
              "பயிர் அறுவடைக்கு முன்",
            ],
            correct: 1,
          },
          {
            question: "பூச்சி எதிர்ப்பு சக்தி உள்ள பயிர் வகை?",
            options: [
              "பாரம்பரிய பயிர்",
              "GM பயிர்",
              "கலப்பின பயிர்",
              "அனைத்தும்",
            ],
            correct: 1,
          },
          {
            question: "பூச்சி மேலாண்மையில் முக்கிய குறிக்கோள்?",
            options: [
              "அனைத்து பூச்சிகளையும் அழித்தல்",
              "சமநிலை பேணுதல்",
              "விலை குறைத்தல்",
              "நேரம் சேமித்தல்",
            ],
            correct: 1,
          },
        ],
      },
      {
        id: 6,
        title: "அறுவடை மற்றும் பின் அறுவடை மேலாண்மை",
        description: "அறுவடை நேரம் மற்றும் பின் அறுவடை ச正确处理 முறைகள்",
        tokens: 160,
        videos: [
          {
            title: "சரியான அறுவடை நேரம் தீர்மானித்தல்",
            youtubeId: "mWzZmM-lkAY",
            duration: "7:45",
          },
          {
            title: "அறுவடை முறைகள் மற்றும் கருவிகள்",
            youtubeId: "m59bwJgKKzE",
            duration: "9:20",
          },
          {
            title: "பின் அறுவடை செயலாக்கம் மற்றும் சேமிப்பு",
            youtubeId: "Kc-zXz8JKjg",
            duration: "11:30",
          },
          {
            title: "தரம் கட்டுப்பாடு மற்றும் சந்தைப்படுத்தல்",
            youtubeId: "bB7Y3E4Cj1s",
            duration: "10:15",
          },
        ],
        quiz: [
          {
            question: "அறுவடைக்கு ஏற்ற நேரம் எது?",
            options: [
              "பயிர் பக்குவமாகும் முன்",
              "பயிர் முழு பக்குவம்",
              "பயிர் காய்ந்த பின்",
              "எப்போதும்",
            ],
            correct: 1,
          },
          {
            question: "பின் அறுவடை இழப்பை குறைக்கும் முறை?",
            options: [
              "சரியான சேமிப்பு",
              "விரைவு விற்பனை",
              "குறைந்த விலை",
              "அதிக உற்பத்தி",
            ],
            correct: 0,
          },
          {
            question: "தானியங்களை சேமிப்பதற்கு ஏற்ற வெப்பநிலை?",
            options: ["30-35°C", "20-25°C", "10-15°C", "5-10°C"],
            correct: 2,
          },
          {
            question: "அறுவடைக்கு பின் முக்கியமான காரணி?",
            options: ["விலை", "தரம்", "நிறம்", "அளவு"],
            correct: 1,
          },
          {
            question: "பயிர் இழப்பை குறைக்கும் முக்கிய காரணி?",
            options: [
              "சரியான நேரம்",
              "சரியான முறை",
              "சரியான கருவி",
              "மேலே உள்ள அனைத்தும்",
            ],
            correct: 3,
          },
        ],
      },
      {
        id: 7,
        title: "நவீன விவசாய தொழில்நுட்பங்கள்",
        description:
          "டிஜிட்டல் விவசாயம் மற்றும் நவீன தொழில்நுட்பங்களின் பயன்பாடு",
        tokens: 200,
        videos: [
          {
            title: "டிஜிட்டல் விவசாயம் மற்றும் IoT",
            youtubeId: "9dTwr6R4-4Q",
            duration: "12:30",
          },
          {
            title: "ட்ரோன் தொழில்நுட்பம் விவசாயத்தில்",
            youtubeId: "cPxPGxKPaCs",
            duration: "10:45",
          },
          {
            title: "துல்லியமான விவசாய முறைகள்",
            youtubeId: "Y3tF_u-uNAA",
            duration: "11:20",
          },
          {
            title: "விவசாய பயன்பாடுகள் மற்றும் மென்பொருட்கள்",
            youtubeId: "m5V_IaF6YQo",
            duration: "9:15",
          },
        ],
        quiz: [
          {
            question: "IoT இன் முழு வடிவம் என்ன?",
            options: [
              "Internet of Things",
              "International of Technology",
              "Internet of Technology",
              "International of Things",
            ],
            correct: 0,
          },
          {
            question: "ட்ரோன் மூலம் என்ன செய்ய முடியும்?",
            options: [
              "நீர்ப்பாசனம்",
              "உரமிடுதல்",
              "பூச்சி மருந்து தெளித்தல்",
              "மேலே உள்ள அனைத்தும்",
            ],
            correct: 3,
          },
          {
            question: "துல்லியமான விவசாயத்தின் நன்மை?",
            options: [
              "வளங்களை மிச்சப்படுத்துதல்",
              "உற்பத்தி அதிகரிப்பு",
              "செலவு குறைப்பு",
              "மேலே உள்ள அனைத்தும்",
            ],
            correct: 3,
          },
          {
            question: "விவசாய பயன்பாடுகளின் பயன்?",
            options: [
              "சந்தை விலை தகவல்",
              "காலநிலை முன்னறிவிப்பு",
              "பயிர் நோய் அடையாளம்",
              "மேலே உள்ள அனைத்தும்",
            ],
            correct: 3,
          },
          {
            question: "நவீன விவசாயத்தின் எதிர்காலம்?",
            options: [
              "டிஜிட்டல் மயமாக்கல்",
              "தொழில்நுட்ப ஒருங்கிணைப்பு",
              "தானியங்கி மயமாக்கல்",
              "மேலே உள்ள அனைத்தும்",
            ],
            correct: 3,
          },
        ],
      },
    ],
  },
  english: {
    modules: [
      {
        id: 1,
        title: "Understanding Soil",
        description: "Start your farming journey with soil knowledge",
        tokens: 100,
        videos: [
          {
            title: "Soil Types and Properties",
            youtubeId: "kGQlGpRqzaE",
            duration: "8:45",
          },
          {
            title: "Soil Health and pH Value",
            youtubeId: "mWzZmM-lkAY",
            duration: "7:30",
          },
          {
            title: "Soil Moisture and Water Retention",
            youtubeId: "bB7Y3E4Cj1s",
            duration: "9:15",
          },
          {
            title: "Soil Fertility Improvement",
            youtubeId: "9dTwr6R4-4Q",
            duration: "10:20",
          },
        ],
        quiz: [
          {
            question: "Which soil is best for farming?",
            options: ["Sandy soil", "Clay soil", "Loamy soil", "Rocky soil"],
            correct: 2,
          },
          {
            question: "What is the ideal pH range for healthy soil?",
            options: ["3-4", "5-6", "6.5-7.5", "8-9"],
            correct: 2,
          },
          {
            question: "Why is organic matter important in soil?",
            options: ["For color", "For nutrients", "For weight", "For heat"],
            correct: 1,
          },
          {
            question: "How to test soil moisture?",
            options: ["Taste it", "Squeeze by hand", "By smell", "By color"],
            correct: 1,
          },
          {
            question: "Which soil retains water best?",
            options: ["Sandy soil", "Loamy soil", "Clay soil", "Rocky soil"],
            correct: 2,
          },
        ],
      },
      {
        id: 2,
        title: "Choosing the Right Crop",
        description: "Find the perfect crop for your soil and climate",
        tokens: 150,
        videos: [
          {
            title: "Climate and Crop Selection",
            youtubeId: "FsXFbJxG_Eg",
            duration: "10:20",
          },
          {
            title: "Seasonal Crop Planning",
            youtubeId: "jT5oAqb0i1s",
            duration: "8:50",
          },
          {
            title: "Profitable Crops and Market Demand",
            youtubeId: "ZMrCD-0Ux4o",
            duration: "11:15",
          },
          {
            title: "Intercropping Methods",
            youtubeId: "nHwpw0ZG9w8",
            duration: "9:40",
          },
        ],
        quiz: [
          {
            question: "Best crop for monsoon season?",
            options: ["Wheat", "Rice", "Chickpea", "Corn"],
            correct: 1,
          },
          {
            question: "Which crop needs less water?",
            options: ["Rice", "Sugarcane", "Millet", "Banana"],
            correct: 2,
          },
          {
            question: "What is the benefit of intercropping?",
            options: [
              "More space",
              "Less space",
              "Risk management",
              "Higher price",
            ],
            correct: 2,
          },
          {
            question: "Most profitable vegetable in Tamil Nadu?",
            options: ["Potato", "Tomato", "Onion", "Carrot"],
            correct: 1,
          },
          {
            question: "Key factor in crop selection?",
            options: ["Color", "Name", "Soil type", "Brand"],
            correct: 2,
          },
        ],
      },
      {
        id: 3,
        title: "Water & Irrigation Basics",
        description: "Learn efficient water management techniques",
        tokens: 120,
        videos: [
          {
            title: "Irrigation Methods and Types",
            youtubeId: "mWzZmM-lkAY",
            duration: "9:30",
          },
          {
            title: "Drip Irrigation Technology",
            youtubeId: "m59bwJgKKzE",
            duration: "10:45",
          },
          {
            title: "Water Conservation Techniques",
            youtubeId: "Kc-zXz8JKjg",
            duration: "8:20",
          },
          {
            title: "Rainwater Harvesting Methods",
            youtubeId: "bB7Y3E4Cj1s",
            duration: "11:10",
          },
        ],
        quiz: [
          {
            question: "Best method for water conservation?",
            options: [
              "Flood irrigation",
              "Drip irrigation",
              "Sprinkler",
              "Canal",
            ],
            correct: 1,
          },
          {
            question: "When do crops need water?",
            options: [
              "Always",
              "When soil is dry",
              "Evening only",
              "In sunlight",
            ],
            correct: 1,
          },
          {
            question: "Advantage of drip irrigation?",
            options: [
              "More water",
              "Water saving",
              "Low cost",
              "No maintenance",
            ],
            correct: 1,
          },
          {
            question: "Why is rainwater harvesting important?",
            options: ["Clean", "Free", "Groundwater recharge", "Cold"],
            correct: 2,
          },
          {
            question: "Best time for irrigation?",
            options: ["Noon", "Morning/Evening", "Afternoon", "Anytime"],
            correct: 1,
          },
        ],
      },
      {
        id: 4,
        title: "Fertilization and Nutrient Management",
        description: "Methods to provide proper nutrition to crops",
        tokens: 130,
        videos: [
          {
            title: "Basic Plant Nutrients",
            youtubeId: "m5V_IaF6YQo",
            duration: "8:30",
          },
          {
            title: "Organic Fertilizers and Preparation",
            youtubeId: "cPxPGxKPaCs",
            duration: "12:15",
          },
          {
            title: "Safe Use of Chemical Fertilizers",
            youtubeId: "Y3tF_u-uNAA",
            duration: "9:45",
          },
          {
            title: "Soil Fertility Testing and Management",
            youtubeId: "9dTwr6R4-4Q",
            duration: "10:20",
          },
        ],
        quiz: [
          {
            question: "Key nutrient for plant growth?",
            options: ["Nitrogen", "Carbon", "Hydrogen", "Oxygen"],
            correct: 0,
          },
          {
            question: "Benefit of organic fertilizer?",
            options: [
              "Quick effect",
              "Soil health",
              "Low cost",
              "High production",
            ],
            correct: 1,
          },
          {
            question: "What does NPK stand for?",
            options: [
              "Nitrogen, Phosphorus, Potassium",
              "Nitrogen, Phosphorus, Carbon",
              "Nitrogen, Potassium, Calcium",
              "Nitrogen, Phosphorus, Calcium",
            ],
            correct: 0,
          },
          {
            question: "Why is soil testing important?",
            options: [
              "To see color",
              "To know nutrient needs",
              "To reduce cost",
              "To save time",
            ],
            correct: 1,
          },
          {
            question: "Which fertilizer is safest?",
            options: ["Chemical", "Organic", "Liquid", "Synthetic"],
            correct: 1,
          },
        ],
      },
      {
        id: 5,
        title: "Pest and Disease Management",
        description: "Natural methods to control pests and diseases",
        tokens: 140,
        videos: [
          {
            title: "Common Crop Diseases and Symptoms",
            youtubeId: "FsXFbJxG_Eg",
            duration: "11:20",
          },
          {
            title: "Natural Pesticide Preparation",
            youtubeId: "jT5oAqb0i1s",
            duration: "13:45",
          },
          {
            title: "Biological Control Methods",
            youtubeId: "ZMrCD-0Ux4o",
            duration: "10:30",
          },
          {
            title: "Preventive Medicines and Applications",
            youtubeId: "nHwpw0ZG9w8",
            duration: "9:15",
          },
        ],
        quiz: [
          {
            question: "Example of natural pesticide?",
            options: ["Neem oil", "DDT", "Chlorpyrifos", "Carbaryl"],
            correct: 0,
          },
          {
            question: "What is biological control method?",
            options: [
              "Using chemicals",
              "Using natural enemies",
              "Mechanical control",
              "Manual removal",
            ],
            correct: 1,
          },
          {
            question: "When to use preventive medicine?",
            options: [
              "After disease occurs",
              "Before disease occurs",
              "Always",
              "Before harvest",
            ],
            correct: 1,
          },
          {
            question: "Crop type with pest resistance?",
            options: ["Traditional", "GM crop", "Hybrid", "All"],
            correct: 1,
          },
          {
            question: "Main goal in pest management?",
            options: [
              "Kill all pests",
              "Maintain balance",
              "Reduce cost",
              "Save time",
            ],
            correct: 1,
          },
        ],
      },
      {
        id: 6,
        title: "Harvest and Post-Harvest Management",
        description: "Harvest timing and proper post-harvest handling methods",
        tokens: 160,
        videos: [
          {
            title: "Determining Right Harvest Time",
            youtubeId: "mWzZmM-lkAY",
            duration: "7:45",
          },
          {
            title: "Harvest Methods and Tools",
            youtubeId: "m59bwJgKKzE",
            duration: "9:20",
          },
          {
            title: "Post-Harvest Processing and Storage",
            youtubeId: "Kc-zXz8JKjg",
            duration: "11:30",
          },
          {
            title: "Quality Control and Marketing",
            youtubeId: "bB7Y3E4Cj1s",
            duration: "10:15",
          },
        ],
        quiz: [
          {
            question: "Best time for harvest?",
            options: [
              "Before crop matures",
              "When crop fully matures",
              "After crop dries",
              "Anytime",
            ],
            correct: 1,
          },
          {
            question: "Method to reduce post-harvest loss?",
            options: [
              "Proper storage",
              "Quick sale",
              "Low price",
              "High production",
            ],
            correct: 0,
          },
          {
            question: "Ideal temperature for grain storage?",
            options: ["30-35°C", "20-25°C", "10-15°C", "5-10°C"],
            correct: 2,
          },
          {
            question: "Important factor after harvest?",
            options: ["Price", "Quality", "Color", "Size"],
            correct: 1,
          },
          {
            question: "Key factor to reduce crop loss?",
            options: [
              "Right time",
              "Right method",
              "Right tools",
              "All of the above",
            ],
            correct: 3,
          },
        ],
      },
      {
        id: 7,
        title: "Modern Farming Technologies",
        description:
          "Digital agriculture and application of modern technologies",
        tokens: 200,
        videos: [
          {
            title: "Digital Farming and IoT",
            youtubeId: "m5V_IaF6YQo",
            duration: "12:30",
          },
          {
            title: "Drone Technology in Agriculture",
            youtubeId: "cPxPGxKPaCs",
            duration: "10:45",
          },
          {
            title: "Precision Farming Methods",
            youtubeId: "Y3tF_u-uNAA",
            duration: "11:20",
          },
          {
            title: "Farming Apps and Software",
            youtubeId: "9dTwr6R4-4Q",
            duration: "9:15",
          },
        ],
        quiz: [
          {
            question: "Full form of IoT?",
            options: [
              "Internet of Things",
              "International of Technology",
              "Internet of Technology",
              "International of Things",
            ],
            correct: 0,
          },
          {
            question: "What can drones do?",
            options: [
              "Irrigation",
              "Fertilization",
              "Pesticide spraying",
              "All of the above",
            ],
            correct: 3,
          },
          {
            question: "Benefit of precision farming?",
            options: [
              "Resource saving",
              "Production increase",
              "Cost reduction",
              "All of the above",
            ],
            correct: 3,
          },
          {
            question: "Use of farming apps?",
            options: [
              "Market price info",
              "Weather forecast",
              "Crop disease identification",
              "All of the above",
            ],
            correct: 3,
          },
          {
            question: "Future of modern farming?",
            options: [
              "Digitalization",
              "Technology integration",
              "Automation",
              "All of the above",
            ],
            correct: 3,
          },
        ],
      },
    ],
  },
};

const Dashboard = ({ user, language, onLogout, onUserUpdate }) => {
  useEffect(() => {
    console.log("🎯 DASHBOARD DEBUG:");
    console.log("🌐 Current Language:", language);
    console.log("👤 User object:", user);
    console.log("📧 User email:", user?.email);
    console.log("📊 Available Languages:", Object.keys(courseData));
    // Check authentication sources
    console.log("🔍 Checking authentication sources:");
    console.log(
      "📱 localStorage currentUser:",
      localStorage.getItem("currentUser")
    );
    console.log(
      "🌱 localStorage sprouterData:",
      localStorage.getItem("sprouterData")
    );
    console.log(
      "💾 sessionStorage learningPathUser:",
      sessionStorage.getItem("learningPathUser")
    );
  }, [language, user]);

  const [currentModule, setCurrentModule] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showBadgePopup, setShowBadgePopup] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState("");
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [localUser, setLocalUser] = useState(user);
  const [recoveryAttempted, setRecoveryAttempted] = useState(false);

  // Sync localUser with prop changes
  useEffect(() => {
    console.log("🔄 Dashboard user sync:", user);

    const syncUserFromAuth = async () => {
      // Priority 1: Use prop user if available and valid
      if (user && user.email && user.email !== "guest@agrovihan.com") {
        console.log("✅ Using valid user from props");
        setLocalUser(user);
        setRecoveryAttempted(false);
        return;
      }

      // Priority 2: Check main authentication sources
      const mainUser = localStorage.getItem("currentUser");
      const sprouterData = localStorage.getItem("sprouterData");

      if (mainUser) {
        try {
          const userData = JSON.parse(mainUser);
          if (userData && userData.email && userData.email !== "") {
            console.log("📱 Using user from main authentication:", userData);

            const completeUser = {
              email: userData.email,
              fullName: userData.fullName || userData.name || "User",
              language: userData.language || language,
              phone: userData.phone || "",
              farmTokens: userData.farmTokens || 0,
              completedModules: userData.completedModules || [],
              currentModule: userData.currentModule || 1,
              moduleProgress: userData.moduleProgress || {},
              badges: userData.badges || [],
            };

            setLocalUser(completeUser);
            onUserUpdate(completeUser);
            setRecoveryAttempted(false);
            return;
          }
        } catch (error) {
          console.error("❌ Error parsing mainUser:", error);
        }
      }

      if (sprouterData) {
        try {
          const userData = JSON.parse(sprouterData);
          if (userData && userData.email && userData.email !== "") {
            console.log("🌱 Using user from sprouter data:", userData);

            const completeUser = {
              email: userData.email,
              fullName: userData.fullName || userData.name || "User",
              language: userData.language || language,
              phone: userData.phone || "",
              farmTokens: userData.farmTokens || 0,
              completedModules: userData.completedModules || [],
              currentModule: userData.currentModule || 1,
              moduleProgress: userData.moduleProgress || {},
              badges: userData.badges || [],
            };

            setLocalUser(completeUser);
            onUserUpdate(completeUser);
            setRecoveryAttempted(false);
            return;
          }
        } catch (error) {
          console.error("❌ Error parsing sprouterData:", error);
        }
      }

      // If we reach here, no valid user found
      console.log("❌ No valid authenticated user found");
    };

    syncUserFromAuth();
  }, [user, language, onUserUpdate]);

  // Enhanced user data recovery with better error handling
  const recoverUserData = async () => {
    console.log("🔄 Attempting user data recovery...");
    setRecoveryAttempted(true);

    // Try multiple sources for user data
    const authSources = [
      {
        name: "main_auth_currentUser",
        data: localStorage.getItem("currentUser"),
        priority: 1,
      },
      {
        name: "sprouter_data",
        data: localStorage.getItem("sprouterData"),
        priority: 2,
      },
      {
        name: "session_storage",
        data: sessionStorage.getItem("learningPathUser"),
        priority: 3,
      },
    ];
    authSources.sort((a, b) => a.priority - b.priority);

    for (const source of authSources) {
      if (source.data) {
        try {
          const userData = JSON.parse(source.data);
          console.log(`📦 Checking ${source.name}:`, userData);

          if (userData && userData.email && userData.email !== "") {
            console.log(`✅ Valid user found in ${source.name}:`, userData);

            // Create complete user object with all required fields
            const completeUser = {
              email: userData.email,
              fullName: userData.fullName || userData.name || "User",
              language: userData.language || language,
              phone: userData.phone || "",
              farmTokens: userData.farmTokens || 0,
              completedModules: userData.completedModules || [],
              currentModule: userData.currentModule || 1,
              moduleProgress: userData.moduleProgress || {},
              badges: userData.badges || [],
            };

            // Update session storage for future use
            sessionStorage.setItem(
              "learningPathUser",
              JSON.stringify(completeUser)
            );
            if (source.priority === 1) {
              localStorage.setItem(
                "currentUser",
                JSON.stringify({ ...userData, ...completeUser })
              );
            }

            setLocalUser(completeUser);
            onUserUpdate(completeUser);
            return completeUser;
          }
        } catch (error) {
          console.error(`❌ Error parsing ${source.name}:`, error);
        }
      }
    }

    console.error(
      "❌ User recovery failed - no valid user data found in any source"
    );

    // Create a fallback guest user to prevent complete failure
    const guestUser = {
      email: "guest@agrovihan.com",
      fullName: "Guest User",
      language: language,
      phone: "",
      farmTokens: 0,
      completedModules: [],
      currentModule: 1,
      moduleProgress: {},
      badges: [],
    };

    console.log("👤 Using fallback guest user");
    setLocalUser(guestUser);
    return guestUser;
  };

  const startModule = (moduleId) => {
    setCurrentModule(moduleId);
    setCurrentVideo(0);
    setShowQuiz(false);
    setShowResults(false);
    setQuizAnswers({});
  };

  const completeVideo = () => {
    const module = courseData[language].modules.find(
      (m) => m.id === currentModule
    );
    if (currentVideo < module.videos.length - 1) {
      setCurrentVideo(currentVideo + 1);
    } else {
      setShowQuiz(true);
    }
  };

  const handleQuizAnswer = (questionIndex, answerIndex) => {
    setQuizAnswers({ ...quizAnswers, [questionIndex]: answerIndex });
  };

  // Enhanced submitQuiz with better auth handling
  const submitQuiz = async () => {
    console.log("🔄 submitQuiz called");
    setSubmittingQuiz(true);

    try {
      let currentUser = localUser;

      // Check if we need to recover user data
      if (
        !currentUser ||
        !currentUser.email ||
        currentUser.email === "guest@agrovihan.com"
      ) {
        console.log(
          "🔍 User data missing or guest mode, checking authentication..."
        );
        currentUser = await recoverUserData();

        if (
          !currentUser ||
          !currentUser.email ||
          currentUser.email === "guest@agrovihan.com"
        ) {
          console.error("❌ No authenticated user found");
          alert(
            "Please log in to save your progress. Your current session will continue in guest mode."
          );
          setShowResults(true);
          setSubmittingQuiz(false);
          return;
        }
      }

      console.log(
        "✅ Using authenticated user for quiz submission:",
        currentUser
      );

      const module = courseData[language].modules.find(
        (m) => m.id === currentModule
      );

      if (!module) {
        console.error("❌ Module not found:", currentModule);
        setSubmittingQuiz(false);
        return;
      }

      let correctCount = 0;
      module.quiz.forEach((q, index) => {
        if (quizAnswers[index] === q.correct) correctCount++;
      });

      const tokensEarned = correctCount * 20 + module.tokens;

      console.log(
        "🎯 Submitting quiz for authenticated user:",
        currentUser.email
      );

      const updatedUser = await DatabaseService.completeModule(
        currentUser.email,
        currentUser,
        currentModule,
        tokensEarned,
        correctCount
      );

      console.log("✅ Quiz submitted successfully:", updatedUser);
      setLocalUser(updatedUser);
      onUserUpdate(updatedUser);
      setShowResults(true);

      // Show badge popup only when all modules are completed
      if (
        updatedUser.completedModules.length ===
        courseData[language].modules.length
      ) {
        const badge =
          language === "tamil" ? "🏆 விவசாய மாஸ்டர்" : "🏆 Farming Master";
        setEarnedBadge(badge);
        setShowBadgePopup(true);
      }
    } catch (error) {
      console.error("❌ Error submitting quiz:", error);
      alert("Error submitting quiz. Please try again.");
    } finally {
      setSubmittingQuiz(false);
    }
  };

  // Enhanced user status check
  const isGuestUser = () => {
    return (
      !localUser ||
      !localUser.email ||
      localUser.email === "guest@agrovihan.com"
    );
  };

  const getUserDisplayInfo = () => {
    if (isGuestUser()) {
      return {
        email: "Guest User (Progress not saved)",
        isGuest: true,
      };
    }

    return {
      email: localUser?.email || "No email",
      isGuest: false,
    };
  };
  const getModuleStatus = (moduleId) => {
    if (!localUser || !localUser.completedModules) return "locked";
    if (localUser.completedModules.includes(moduleId)) return "completed";
    if (moduleId === localUser.currentModule) return "current";
    if (moduleId > localUser.currentModule) return "locked";
    return "available";
  };

  // Badge Popup
  if (showBadgePopup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full border border-green-100 text-center">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6 animate-bounce">
            <Award className="w-16 h-16 text-white" />
          </div>

          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            {language === "tamil" ? "வாழ்த்துக்கள்!" : "Congratulations!"}
          </h2>
          <p className="text-2xl mb-6">{earnedBadge}</p>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 mb-8 border border-yellow-200">
            <div className="flex items-center justify-center space-x-2 text-yellow-700">
              <Coins className="w-6 h-6" />
              <span className="text-xl font-semibold">
                {language === "tamil"
                  ? "மொத்த FarmTokens:"
                  : "Total FarmTokens:"}
              </span>
              <span className="text-3xl font-bold">
                {localUser?.farmTokens || 0}
              </span>
            </div>
          </div>

          <p className="text-gray-600 mb-8 text-lg">
            {language === "tamil"
              ? "நீங்கள் அனைத்து தொகுதிகளையும் வெற்றிகரமாக முடித்துவிட்டீர்கள்!"
              : "You have successfully completed all modules!"}
          </p>

          <button
            onClick={() => setShowBadgePopup(false)}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl text-lg"
          >
            {language === "tamil" ? "தொடரவும்" : "Continue"}
          </button>
        </div>
      </div>
    );
  }

  // Video Player Screen
  if (currentModule && !showQuiz && !showResults) {
    const module = courseData[language].modules.find(
      (m) => m.id === currentModule
    );
    const video = module.videos[currentVideo];

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {module.title}
                </h2>
                <p className="text-gray-600 mt-1">
                  Video {currentVideo + 1} of {module.videos.length}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-yellow-50 px-4 py-2 rounded-full border border-yellow-200">
                  <Coins className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="font-bold text-yellow-700">
                    {localUser?.farmTokens || 0}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6 border border-green-100">
            <div className="aspect-video bg-black">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${video.youtubeId}`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {video.title}
              </h3>
              <div className="flex items-center text-gray-600">
                <Play className="w-4 h-4 mr-2" />
                <span>{video.duration}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-green-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">
                Module Progress
              </span>
              <span className="text-sm font-bold text-green-600">
                {currentVideo + 1}/{module.videos.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    ((currentVideo + 1) / module.videos.length) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>

          <button
            onClick={completeVideo}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <span>
              {currentVideo < module.videos.length - 1
                ? "Next Video"
                : "Take Quiz"}
            </span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // Quiz Screen
  if (showQuiz && !showResults) {
    const module = courseData[language].modules.find(
      (m) => m.id === currentModule
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-100">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {module.title} - Quiz
              </h2>
              <p className="text-gray-600">
                Answer all questions to earn FarmTokens!
              </p>
              {localUser?.email === "guest@agrovihan.com" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                  <p className="text-yellow-700 text-sm">
                    <strong>Guest Mode:</strong> Your progress will not be
                    saved. Please log in to save your progress and earn
                    FarmTokens.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {module.quiz.map((question, qIndex) => (
                <div
                  key={qIndex}
                  className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                >
                  <h3 className="font-semibold text-gray-800 mb-4">
                    {qIndex + 1}. {question.question}
                  </h3>
                  <div className="space-y-3">
                    {question.options.map((option, oIndex) => (
                      <button
                        key={oIndex}
                        onClick={() => handleQuizAnswer(qIndex, oIndex)}
                        className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                          quizAnswers[qIndex] === oIndex
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-200 hover:border-green-300 hover:bg-green-50"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={submitQuiz}
              disabled={
                Object.keys(quizAnswers).length < module.quiz.length ||
                submittingQuiz
              }
              className="w-full mt-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submittingQuiz ? "Submitting..." : "Submit Quiz"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (showResults) {
    const module = courseData[language].modules.find(
      (m) => m.id === currentModule
    );
    const progress = localUser?.moduleProgress?.[currentModule];

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full border border-green-100">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6 animate-bounce">
              <Trophy className="w-12 h-12 text-white" />
            </div>

            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {language === "tamil" ? "வாழ்த்துக்கள்!" : "Congratulations!"}
            </h2>
            <p className="text-gray-600 mb-8">
              {language === "tamil"
                ? "நீங்கள் தொகுதியை முடித்துவிட்டீர்கள்!"
                : "You completed the module!"}
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">
                  {progress?.score || 0}/5
                </div>
                <div className="text-sm text-gray-600">
                  {language === "tamil" ? "சரியான பதில்கள்" : "Correct Answers"}
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                <Coins className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">
                  +{progress?.tokensEarned || 0}
                </div>
                <div className="text-sm text-gray-600">FarmTokens</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-8 border border-green-200">
              <div className="flex items-center justify-center space-x-2 text-green-700">
                <Coins className="w-5 h-5" />
                <span className="font-semibold">
                  {language === "tamil"
                    ? "மொத்த FarmTokens:"
                    : "Total FarmTokens:"}
                </span>
                <span className="text-2xl font-bold">
                  {localUser?.farmTokens || 0}
                </span>
              </div>
            </div>

            {localUser?.email === "guest@agrovihan.com" && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-700 text-sm">
                  <strong>Note:</strong> You are in guest mode. Your progress is
                  not saved. Please log in to save your progress permanently.
                </p>
              </div>
            )}

            <button
              onClick={() => {
                setCurrentModule(null);
                setShowQuiz(false);
                setShowResults(false);
                setQuizAnswers({});
              }}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
            >
              {language === "tamil" ? "கற்றலைத் தொடரவும்" : "Continue Learning"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard
  const modules = courseData[language].modules;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-green-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {language === "tamil"
                  ? "உங்கள் கற்றல் பயணம்"
                  : "Your Learning Journey"}
              </h1>

              {/* Enhanced user status display */}
              {(() => {
                const userInfo = getUserDisplayInfo();
                return (
                  <>
                    <p className="text-gray-600">{userInfo.email}</p>
                    {userInfo.isGuest && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mt-2 inline-block">
                        <p className="text-yellow-700 text-sm">
                          <strong>Guest Mode:</strong> Please log in to save
                          progress
                        </p>
                        <button
                          onClick={() => {
                            // Redirect to main authentication
                            window.location.href = "/glogin";
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-1"
                        >
                          Click here to log in →
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 px-6 py-3 rounded-full border-2 border-yellow-200">
                <div className="flex items-center space-x-2">
                  <Coins className="w-6 h-6 text-yellow-600" />
                  <div>
                    <div className="text-xs text-gray-600">FarmTokens</div>
                    <div className="text-xl font-bold text-yellow-700">
                      {localUser?.farmTokens || 0}
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced refresh button */}
              <button
                onClick={recoverUserData}
                className="p-3 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                title="Refresh Authentication"
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              <button
                onClick={onLogout}
                className="p-3 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-green-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {language === "tamil"
              ? "ஒட்டுமொத்த முன்னேற்றம்"
              : "Overall Progress"}
          </h2>
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-600">
              {localUser?.completedModules?.length || 0} / {modules.length}{" "}
              {language === "tamil"
                ? "தொகுதிகள் முடிந்தது"
                : "Modules Completed"}
            </span>
            <span className="font-bold text-green-600">
              {Math.round(
                ((localUser?.completedModules?.length || 0) / modules.length) *
                  100
              )}
              %
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
              style={{
                width: `${
                  ((localUser?.completedModules?.length || 0) /
                    modules.length) *
                  100
                }%`,
              }}
            >
              {(localUser?.completedModules?.length || 0) > 0 && (
                <Star className="w-3 h-3 text-white" />
              )}
            </div>
          </div>
        </div>

        {(localUser?.badges?.length || 0) > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-green-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {language === "tamil" ? "பெற்ற பேட்ஜ்கள்" : "Badges Earned"}
            </h2>
            <div className="flex flex-wrap gap-3">
              {localUser.badges.map((badge, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 px-4 py-2 rounded-full border border-purple-200"
                >
                  <span className="text-lg">{badge}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const status = getModuleStatus(module.id);
            const isLocked = status === "locked";
            const isCompleted = status === "completed";
            const isCurrent = status === "current";

            return (
              <div
                key={module.id}
                className={`bg-white rounded-2xl shadow-lg border-2 overflow-hidden transition-all ${
                  isLocked
                    ? "opacity-60 border-gray-200"
                    : isCompleted
                    ? "border-green-300"
                    : isCurrent
                    ? "border-green-500 shadow-xl"
                    : "border-green-200 hover:border-green-400 hover:shadow-xl"
                }`}
              >
                <div
                  className={`p-6 ${
                    isCompleted
                      ? "bg-gradient-to-br from-green-50 to-emerald-50"
                      : isCurrent
                      ? "bg-gradient-to-br from-blue-50 to-cyan-50"
                      : "bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${
                        isCompleted
                          ? "bg-green-100"
                          : isCurrent
                          ? "bg-blue-100"
                          : "bg-gray-100"
                      }`}
                    >
                      {isLocked ? (
                        <Lock className="w-6 h-6 text-gray-400" />
                      ) : isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <Play className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                      <Coins className="w-4 h-4 text-yellow-600 mr-1" />
                      <span className="text-sm font-bold text-yellow-700">
                        {module.tokens}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {module.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {module.description}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <BookOpen className="w-4 h-4 mr-2" />
                    <span>
                      {module.videos.length}{" "}
                      {language === "tamil" ? "வீடியோக்கள்" : "Videos"}
                    </span>
                  </div>

                  {isCompleted &&
                    localUser?.moduleProgress &&
                    localUser.moduleProgress[module.id] && (
                      <div className="bg-white rounded-lg p-3 mb-4 border border-green-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            {language === "tamil" ? "மதிப்பெண்:" : "Score:"}
                          </span>
                          <span className="font-bold text-green-600">
                            {localUser.moduleProgress[module.id].score}/5
                          </span>
                        </div>
                      </div>
                    )}

                  <button
                    onClick={() => !isLocked && startModule(module.id)}
                    disabled={isLocked}
                    className={`w-full py-3 rounded-xl font-semibold transition-all ${
                      isLocked
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : isCompleted
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {isLocked
                      ? language === "tamil"
                        ? "பூட்டப்பட்டுள்ளது"
                        : "Locked"
                      : isCompleted
                      ? language === "tamil"
                        ? "மீண்டும் பார்க்க"
                        : "Review"
                      : isCurrent
                      ? language === "tamil"
                        ? "தொடங்கவும்"
                        : "Start"
                      : language === "tamil"
                      ? "விரைவில்"
                      : "Coming Soon"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
