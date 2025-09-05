import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Type, 
  Hash, 
  Download, 
  RotateCcw, 
  Sparkles, 
  Loader2, 
  PenTool, 
  BookOpen,
  Star,
  Palette,
  PencilRuler,
  Sparkles as SparklesIcon,
  Zap,
  Smile,
  Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { toast } from 'sonner';

type ActivityType = 'tracing' | 'coloring';
type TracingOption = 'letters' | 'numbers' | 'shapes';

const LearningStudio = () => {
  const [selectedActivity, setSelectedActivity] = useState<ActivityType>('tracing');
  const [selectedTracing, setSelectedTracing] = useState<TracingOption>('letters');
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [showTutorial, setShowTutorial] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [currentTracingItem, setCurrentTracingItem] = useState('A');
  
  // Pre-written prompts for coloring
  const preWrittenPrompts = [
    { emoji: '🦕', text: 'Cute dinosaur in a jungle' },
    { emoji: '🏰', text: 'Magical castle in the clouds' },
    { emoji: '🐠', text: 'Colorful underwater ocean scene' },
    { emoji: '🚀', text: 'Space rocket exploring planets' },
    { emoji: '🦄', text: 'Unicorn in a fairy tale forest' },
    { emoji: '🦁', text: 'Lion with a majestic mane' },
  ];
  
  // Alphabets and numbers for tracing
  const alphabetUppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const numbers = '0123456789'.split('');
  const alphabetLowercase = 'abcdefghijklmnopqrstuvwxyz'.split('');
  
  // Group uppercase letters into rows for better display
  const letterRows = [
    alphabetUppercase.slice(0, 13),
    alphabetUppercase.slice(13, 26)
  ];
  
  const numberRows = [
    numbers.slice(0, 5),
    numbers.slice(5, 10)
  ];
  
  const getTracingItems = () => {
    switch(selectedTracing) {
      case 'letters':
        return alphabetUppercase;
      case 'numbers':
        return numbers;
      default:
        return [];
    }
  };
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeFeature, setActiveFeature] = useState(0);
  
  const features = [
    {
      icon: <Palette className="w-8 h-8 text-indigo-500" />,
      title: "Creative Coloring",
      description: "Bring your imagination to life with AI-generated coloring pages"
    },
    {
      icon: <PencilRuler className="w-8 h-8 text-pink-500" />,
      title: "Fun Tracing",
      description: "Practice letters and numbers with our interactive tracing"
    },
    {
      icon: <SparklesIcon className="w-8 h-8 text-yellow-500" />,
      title: "Endless Learning",
      description: "Engaging activities to make learning fun and effective"
    }
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleGenerateColoringPage = async () => {
    try {
      setIsGenerating(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setGeneratedImage('https://via.placeholder.com/500x500?text=AI+Generated+Coloring+Page');
      toast.success('Coloring page generated successfully!');
    } catch (error) {
      console.error('Error generating coloring page:', error);
      toast.error('Failed to generate coloring page. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-indigo-100 shadow-sm">
        <div className="container flex items-center h-16 px-4">
          <div className="flex items-center space-x-4">
            <PenTool className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Learning Studio</h1>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowTutorial(!showTutorial)}
            >
              <BookOpen className="h-5 w-5" />
              <span className="sr-only">Tutorial</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <motion.h1 
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent"
            >
              Welcome to Learning Studio
            </motion.h1>
            <motion.p 
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Where learning meets creativity! Choose an activity below to get started.
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={`p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-indigo-50 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${activeFeature === index ? 'ring-2 ring-indigo-500' : ''}`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <Tabs 
              value={selectedActivity} 
              onValueChange={(value) => setSelectedActivity(value as ActivityType)}
              className="space-y-4"
            >
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-indigo-50 p-1 rounded-xl m-6">
                <TabsTrigger 
                  value="tracing" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 rounded-lg"
                >
                  <PencilRuler className="w-4 h-4 mr-2" />
                  Tracing
                </TabsTrigger>
                <TabsTrigger 
                  value="coloring" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-pink-600 rounded-lg"
                >
                  <Palette className="w-4 h-4 mr-2" />
                  Coloring
                </TabsTrigger>
              </TabsList>
          
              <TabsContent value="tracing" className="p-6 pt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardHeader className="px-0 pt-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl font-bold text-gray-900">Tracing Fun!</CardTitle>
                        <CardDescription className="text-gray-600">
                          Practice makes perfect! Trace letters, numbers, and shapes with our interactive tools.
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="rounded-full">
                          <Star className="w-4 h-4 mr-1 text-yellow-500" />
                          Save
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex space-x-2">
                          <Button 
                            variant={selectedTracing === 'letters' ? 'default' : 'outline'}
                            onClick={() => setSelectedTracing('letters')}
                          >
                            <Type className="mr-2 h-4 w-4" />
                            Letters
                          </Button>
                          <Button 
                            variant={selectedTracing === 'numbers' ? 'default' : 'outline'}
                            onClick={() => setSelectedTracing('numbers')}
                          >
                            <Hash className="mr-2 h-4 w-4" />
                            Numbers
                          </Button>
                        </div>
                      </div>
                        
                      {/* Pre-written letters/numbers grid */}
                      <div className="bg-white/50 rounded-xl p-4 border border-indigo-100">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                          Select a {selectedTracing === 'letters' ? 'Letter' : 'Number'} to Trace:
                        </h3>
                        
                        {selectedTracing === 'letters' ? (
                          <div className="space-y-2">
                            {letterRows.map((row, rowIndex) => (
                              <div key={`row-${rowIndex}`} className="flex flex-wrap gap-2 justify-center">
                                {row.map((char, charIndex) => (
                                  <motion.button
                                    key={`${char}-${charIndex}`}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setCurrentTracingItem(char)}
                                    className={`w-10 h-10 flex items-center justify-center rounded-lg text-lg font-medium transition-colors ${
                                      currentTracingItem === char
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-indigo-50 border border-gray-200'
                                    }`}
                                  >
                                    {char}
                                  </motion.button>
                                ))}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2 justify-center">
                            {numbers.map((number, index) => (
                              <motion.button
                                key={index}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setCurrentTracingItem(number)}
                                className={`w-12 h-12 flex items-center justify-center rounded-lg text-xl font-medium transition-colors ${
                                  currentTracingItem === number
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-indigo-50 border border-gray-200'
                                }`}
                              >
                                {number}
                              </motion.button>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="border-2 border-dashed border-indigo-100 rounded-2xl p-6 bg-white/50 backdrop-blur-sm relative">
                        <div className="flex items-center justify-center h-96">
                          <div className="text-center">
                            <div className="text-9xl font-bold text-indigo-200 mb-4 select-none">
                              {currentTracingItem}
                            </div>
                            <p className="text-gray-500 text-sm">
                              Trace the {selectedTracing === 'letters' ? 'letter' : 'number'} above
                            </p>
                          </div>
                        </div>
                        <canvas
                          ref={canvasRef}
                          className="absolute inset-0 w-full h-full rounded-xl opacity-70 cursor-crosshair"
                        />
                        <div className="mt-4 flex justify-between">
                          <Button variant="outline" size="sm">
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Clear
                          </Button>
                          <Button size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Save
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </motion.div>
              </TabsContent>
          
              <TabsContent value="coloring" className="p-6 pt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardHeader className="px-0 pt-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl font-bold text-gray-900">Magical Coloring</CardTitle>
                        <CardDescription className="text-gray-600">
                          Let your imagination run wild with AI-generated coloring pages!
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 flex items-center">
                          <Lightbulb className="w-3 h-3 mr-1 text-yellow-500" />
                          Try: "Cute dinosaur" or "Magical castle"
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Choose a prompt or write your own:</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                              {preWrittenPrompts.map((item, index) => (
                                <motion.button
                                  key={index}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => {
                                    setPrompt(item.text);
                                    setSelectedPrompt(item.text);
                                  }}
                                  className={`p-3 rounded-xl text-left transition-all duration-200 border-2 ${
                                    selectedPrompt === item.text 
                                      ? 'border-indigo-500 bg-indigo-50' 
                                      : 'border-gray-200 hover:border-indigo-300 bg-white'
                                  }`}
                                >
                                  <span className="text-2xl mb-1 block">{item.emoji}</span>
                                  <span className="text-sm font-medium text-gray-700">{item.text}</span>
                                </motion.button>
                              ))}
                            </div>
                          </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between mb-2">
                          <label htmlFor="custom-prompt" className="text-sm font-medium text-gray-700">
                            Or type your own idea:
                          </label>
                          <button 
                            type="button" 
                            onClick={() => {
                              setPrompt('');
                              setSelectedPrompt('');
                            }}
                            className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
                          >
                            Clear
                          </button>
                        </div>
                        <div className="relative">
                          <Textarea
                            id="custom-prompt"
                            placeholder="Example: A dragon breathing rainbow fire..."
                            value={prompt}
                            onChange={(e) => {
                              setPrompt(e.target.value);
                              if (e.target.value) setSelectedPrompt('');
                            }}
                            className="min-h-[100px] text-base border-2 border-indigo-100 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 rounded-xl p-4"
                            onFocus={() => setIsHovered(true)}
                            onBlur={() => setIsHovered(false)}
                          />
                          <AnimatePresence>
                            {isHovered && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute -bottom-2 right-2 bg-white px-3 py-1 rounded-full text-xs text-gray-500 shadow-md border border-gray-100 flex items-center"
                              >
                                <Lightbulb className="w-3 h-3 mr-1 text-yellow-500" />
                                Try: "Cute dinosaur" or "Magical castle"
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <div className="flex justify-end pt-2">
                          <Button 
                            onClick={handleGenerateColoringPage}
                            disabled={isGenerating || (!prompt.trim() && !selectedPrompt)}
                            className="bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-medium rounded-xl px-8 py-6 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-indigo-200 disabled:opacity-70 disabled:transform-none"
                          >
                            {isGenerating ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Generate
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      {generatedImage && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="border-2 border-indigo-100 rounded-2xl p-4 bg-white/50 backdrop-blur-sm"
                        >
                          <img 
                            src={generatedImage} 
                            alt="Generated coloring page" 
                            className="w-full h-auto rounded-xl border-2 border-indigo-100"
                          />
                          <div className="mt-4 flex justify-end">
                            <Button className="bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700">
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LearningStudio;
