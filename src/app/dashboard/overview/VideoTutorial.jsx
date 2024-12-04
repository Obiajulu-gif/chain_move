// components/dashboard/VideoTutorial.js
import React from "react";

const VideoTutorial = () => {
  return (
    <div className="bg-gray-800 p-12 rounded-lg flex flex-col items-center shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-white text-2xl font-semibold mb-6 tracking-wide text-center">
        How to use our platform
      </h3>
      <button className="bg-orange-500 text-white py-3 px-8 rounded-full font-semibold text-lg tracking-wide hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-300 transition duration-300 transform hover:scale-105">
        Watch on YouTube
      </button>
    </div>
  );
};

export default VideoTutorial;
