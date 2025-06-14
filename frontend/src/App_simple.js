import React from "react";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      <div className="max-w-md w-full p-8">
        <div className="bg-black bg-opacity-20 backdrop-blur-lg rounded-2xl p-8 border border-pink-500/20 text-center">
          {/* Logo */}
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">EL</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">EuroLove</h1>
          <p className="text-gray-300 mb-6">Premium Dating Platform</p>
          
          <div className="space-y-4">
            <button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200">
              Login
            </button>
            <button className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200">
              Register
            </button>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Platform Status: <span className="text-green-400">Online</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;