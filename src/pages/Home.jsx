import React from 'react';
import { Link } from 'react-router-dom';
import { FiVideo, FiYoutube, FiBarChart2, FiPlayCircle } from 'react-icons/fi';
import Button from '../components/common/Button';

function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                AI-Powered Video Metadata for Content Creators
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Generate SEO-optimized titles, descriptions, tags, and thumbnails for your videos in seconds. 
                Publish directly to YouTube with a single click.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg">
                    Get Started — It's Free
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline" size="lg">
                    <FiPlayCircle className="mr-2" />
                    Try Demo
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-10">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4">
                <img 
                  src="/assets/images/hero-illustration.svg" 
                  alt="MetaGenius in action" 
                  className="w-full rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Simplify Your Content Creation Workflow
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              MetaGenius streamlines your video publishing process by automating the most time-consuming parts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
              <div className="h-14 w-14 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
                <FiVideo className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Metadata Generation</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our AI analyzes your video content to create perfectly optimized titles, 
                descriptions, and tags that improve discoverability.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
              <div className="h-14 w-14 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-6">
                <FiBarChart2 className="h-7 w-7 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">SEO Optimization</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Every piece of metadata is strategically created to maximize your video's search 
                ranking and audience engagement.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
              <div className="h-14 w-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
                <FiYoutube className="h-7 w-7 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">One-Click Uploads</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Connect your YouTube account and publish videos directly from MetaGenius 
                with all optimized metadata included.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How MetaGenius Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Generate perfect video metadata in three simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">1</div>
                <h3 className="text-xl font-semibold mb-3 mt-2">Describe Your Video</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Enter a brief description of your video content and upload your video file or provide a URL.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">2</div>
                <h3 className="text-xl font-semibold mb-3 mt-2">AI Generates Metadata</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Our AI processes your content and generates optimized title, description, tags, and thumbnail options.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">3</div>
                <h3 className="text-xl font-semibold mb-3 mt-2">Publish With One Click</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Review, edit if needed, and publish directly to YouTube or download the metadata for manual upload.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Optimize Your Video Content?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of content creators using MetaGenius to improve their video performance.
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;