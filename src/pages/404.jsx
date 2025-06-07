import { useNavigate } from 'react-router-dom';
import { FaHome, FaRobot, FaVideo, FaExclamationTriangle, FaMagic, FaPalette, FaLightbulb } from 'react-icons/fa';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center p-4 text-center overflow-hidden relative">
      {/* Floating decorative elements */}
      <div className="absolute  -top-20 -left-20 w-64 h-64 rounded-full bg-blue-200 opacity-20 blur-xl"></div>
      <div className="absolute bottom-10 -right-20 w-80 h-80 rounded-full bg-lime-200 opacity-20 blur-xl"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl  w-full"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-blue-200/50">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
            <div className="flex items-center justify-center gap-4">
              <FaExclamationTriangle className="text-4xl" />
              <div>
                <h1 className="text-5xl font-bold">404</h1>
                <p className="text-xl font-medium">Page Not Found</p>
              </div>
              <FaRobot className="text-4xl" />
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8 md:p-10">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-medium text-gray-800 mb-6"
            >
              Our AI couldn't render this page in your video journey
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {/* Feature Card 1 */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white border border-blue-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <FaMagic className="text-blue-600 text-xl" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">AI Video Magic</h3>
                <p className="text-gray-600 text-sm">Create stunning videos with our powerful AI tools</p>
              </motion.div>

              {/* Feature Card 2 */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white border border-blue-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="bg-lime-100 w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <FaPalette className="text-lime-600 text-xl" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Creative Tools</h3>
                <p className="text-gray-600 text-sm">Unleash your creativity with our editing suite</p>
              </motion.div>

              {/* Feature Card 3 */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white border border-blue-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <FaLightbulb className="text-blue-600 text-xl" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Smart Templates</h3>
                <p className="text-gray-600 text-sm">Get started quickly with AI-generated templates</p>
              </motion.div>
            </div>

            <div className="flex flex-col items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-full transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl mb-4"
              >
                <FaHome className="mr-3" />
                Back to {import.meta.env.VITE_APP_NAME}
              </motion.button>
              <p className="text-gray-500 text-sm">or try searching for what you need</p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-blue-50 p-4 text-center text-sm text-gray-600 border-t border-blue-100">
            <p>AI Video Creator • Making video production magical</p>
          </div>
        </div>
      </motion.div>

      {/* Decorative video frame elements */}
      <div className="absolute bottom-5 left-5 w-16 h-16 border-2 border-lime-400/30 rounded-lg transform rotate-12"></div>
      <div className="absolute top-10 right-10 w-20 h-20 border-2 border-blue-400/30 rounded-lg transform -rotate-6"></div>
    </div>
  );
};

export default NotFoundPage;