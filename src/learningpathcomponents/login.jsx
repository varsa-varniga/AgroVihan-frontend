// learningpathcomponnets/Login.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Trophy, Award, Sprout } from "lucide-react";

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) return setError("Please enter your email");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return setError("Enter a valid email");

    setLoading(true);
    setError("");
    try {
      await onLoginSuccess(email);
    } catch {
      setError("Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-100 via-green-200 to-teal-100">
      {/* Background effects */}
      <div className="absolute -top-32 -left-40 w-[500px] h-[500px] bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-white/70 backdrop-blur-lg border border-emerald-200 shadow-2xl rounded-3xl p-10 md:p-12 max-w-md w-full text-center"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="p-5 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 shadow-lg mb-4">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 text-transparent bg-clip-text">
            AgroVihan
          </h1>
          <p className="text-gray-600 mt-2">Grow. Learn. Earn.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all bg-white/50 backdrop-blur"
              disabled={loading}
            />
            {error && (
              <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
            )}
          </div>

          <motion.button
            type="submit"
            whileTap={{ scale: 0.98 }}
            disabled={!email || loading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-emerald-300/50 hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50"
          >
            {loading ? "Loading..." : "Start Learning"}
          </motion.button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-600 flex justify-center gap-6">
          <div className="flex items-center">
            <Trophy className="w-4 h-4 mr-1 text-yellow-500" /> Earn Tokens
          </div>
          <div className="flex items-center">
            <Award className="w-4 h-4 mr-1 text-purple-500" /> Win Badges
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
