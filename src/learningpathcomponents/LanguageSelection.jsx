import React from "react";
import { motion } from "framer-motion";

const LanguageSelection = ({ onLanguageSelect }) => {
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-emerald-100 via-green-200 to-teal-100 flex items-center justify-center overflow-hidden">
      {/* Glowing blobs */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-green-300 rounded-full blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-teal-300 rounded-full blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative bg-white/70 backdrop-blur-lg border border-emerald-200 shadow-xl rounded-3xl p-10 md:p-14 text-center max-w-3xl w-full"
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-3">
          Choose Your Language
        </h2>
        <p className="text-gray-600 mb-10">உங்கள் மொழியை தேர்வு செய்யவும்</p>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onLanguageSelect("tamil")}
            className="group relative overflow-hidden rounded-2xl p-8 border-2 border-orange-200 hover:border-orange-400 bg-gradient-to-br from-orange-50 to-red-50 transition-all hover:shadow-xl"
          >
            <div className="text-center">
              <div className="text-7xl mb-4 animate-bounce">🇮🇳</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">தமிழ்</h3>
              <p className="text-gray-600">Tamil</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-red-400/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onLanguageSelect("english")}
            className="group relative overflow-hidden rounded-2xl p-8 border-2 border-blue-200 hover:border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50 transition-all hover:shadow-xl"
          >
            <div className="text-center">
              <div className="text-7xl mb-4 animate-bounce">🌍</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">English</h3>
              <p className="text-gray-600">English</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default LanguageSelection;
