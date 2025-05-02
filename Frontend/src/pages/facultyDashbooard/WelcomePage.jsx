import React from 'react'
import { motion } from "framer-motion";

const WelcomePage = () => {
  return (
    <div className="p-4 h-96 mt-32 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-purple-900 mb-4">
          Welcome to Faculty Dashboard
        </h1>
        <p className="text-purple-600 text-lg">
          Manage your project submissions and requests efficiently
        </p>
      </motion.div>
    </div>
  );
}

export default WelcomePage
