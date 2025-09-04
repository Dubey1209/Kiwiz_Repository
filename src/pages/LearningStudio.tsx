import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, X, Type, Hash, Image as ImageIcon, Download, RotateCcw, Printer, Sparkles, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

type ActivityType = 'tracing' | 'coloring';
type TracingOption = 'letters' | 'numbers' | 'shapes';

const LearningStudio = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityType>('tracing');
  const [selectedTracing, setSelectedTracing] = useState<TracingOption>('letters');
  const [currentContent, setCurrentContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  const predefinedPrompts = [
    'Cute puppy playing with a ball',
    'Jungle with wild animals',
    'Underwater ocean scene with fish',
    'Space with planets and rockets',
    'Princess in a magical castle',
    'Dinosaur in prehistoric land',
    'Butterfly garden with flowers',
    'Pirate ship on the sea',
    'Fairy tale dragon',
    'Farm with animals'
  ];

  // Initialize component
  useEffect(() => {
    setIsMounted(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Set canvas styles
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = '#000000';
    context.fillStyle = '#ffffff';
    context.lineWidth = 2;
    
    ctx.current = context;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight * 0.8;
      
      if (currentContent) {
        drawTracingContent();
      }
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [currentContent]);

  const drawTracingContent = () => {
    if (!isMounted || !ctx.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const context = ctx.current;
    
    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Only draw if we have content
    if (selectedActivity === 'tracing' && currentContent) {
      // Draw the tracing guide (light gray)
      context.font = '200px Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillStyle = '#e5e7eb';
      context.fillText(currentContent, canvas.width / 2, canvas.height / 2);
      
      // Reset drawing styles
      context.strokeStyle = '#000000';
      context.fillStyle = '#000000';
      context.lineWidth = 2;
    }
  };

  const clearCanvas = () => {
    if (!isMounted || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Clear the entire canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Redraw the tracing guide if we have content
    if (currentContent) {
      drawTracingContent();
    }
  };

  const downloadCanvas = () => {
    if (!isMounted || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `${selectedActivity}-${new Date().getTime()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleTracingSelect = (content: string) => {
    setCurrentContent(content);
    setShowOptions(false);
  };

  const renderTracingOptions = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const numbers = '1234567890'.split('');
    const shapes = ['○', '△', '□', '◇', '☆', '♥'];
    
    let items: string[] = [];
    
    switch (selectedTracing) {
      case 'letters':
        items = letters;
        break;
      case 'numbers':
        items = numbers;
        break;
      case 'shapes':
        items = shapes;
        break;
    }
    
    return (
      <div className="grid grid-cols-6 gap-2 p-4">
        {items.map((item) => (
          <button
            key={item}
            onClick={() => handleTracingSelect(item)}
            className="flex items-center justify-center text-5xl p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 dark:text-gray-100 dark:border-gray-700 transition-colors"
          >
            {item}
          </button>
        ))}
      </div>
    );
  };

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setGeneratedImage('https://placehold.co/600x400/000000/ffffff?text=Generated+Image');
      toast.success('Image generated successfully!');
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderColoringOptions = () => (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3 mb-3">
          {predefinedPrompts.map((suggestion, index) => (
            <Badge 
              key={index}
              variant="outline"
              className="cursor-pointer hover:bg-primary/10 dark:hover:bg-primary/20 text-base py-1.5 px-3 dark:border-primary/30 dark:text-gray-100 dark:bg-gray-800/80 hover:shadow-sm dark:hover:shadow-primary/10 transition-all"
              onClick={() => setPrompt(suggestion)}
            >
              {suggestion}
            </Badge>
          ))}
        </div>
        <Textarea
          placeholder="Describe what you'd like to color (e.g., 'Cute puppy playing with a ball')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[100px]"
        />
        <Button 
          onClick={generateImage} 
          disabled={!prompt.trim() || isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Coloring Page'
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4 max-w-7xl h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold dark:text-white">Learning Studio</h1>
        <div className="flex items-center space-x-2">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={clearCanvas}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
            <Button variant="outline" onClick={downloadCanvas}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowOptions(true)}
              />
              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                onClick={() => setShowOptions(!showOptions)}
              >
                {showOptions ? <X className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
              </Button>
            </div>

            <AnimatePresence>
              {showOptions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 mt-2 w-full bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden"
                >
                  <Tabs defaultValue="tracing" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="tracing" onClick={() => setSelectedActivity('tracing')}>
                        Tracing
                      </TabsTrigger>
                      <TabsTrigger value="coloring" onClick={() => setSelectedActivity('coloring')}>
                        Coloring
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="tracing" className="p-2">
                      <div className="space-y-2">
                        <div className="flex space-x-2">
                          <Button
                            variant={selectedTracing === 'letters' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedTracing('letters')}
                            className="flex-1"
                          >
                            <Type className="h-4 w-4 mr-2" />
                            Letters
                          </Button>
                          <Button
                            variant={selectedTracing === 'numbers' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedTracing('numbers')}
                            className="flex-1"
                          >
                            <Hash className="h-4 w-4 mr-2" />
                            Numbers
                          </Button>
                        </div>
                        <div className="h-64 overflow-y-auto">
                          {renderTracingOptions()}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="coloring" className="p-2">
                      {renderColoringOptions()}
                    </TabsContent>
                  </Tabs>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-100 dark:border-gray-700/50">
            <h3 className="font-medium mb-3 text-gray-800 dark:text-gray-100">Instructions</h3>
            <ul className="text-base text-gray-600 dark:text-gray-300 space-y-2">
              <li>• Select an activity from the menu</li>
              <li>• Use your mouse or touch to draw</li>
              <li>• Change colors and brush size</li>
              <li>• Save your work when done</li>
            </ul>
          </div>
        </div>
        
        {/* Canvas Area */}
        <div className="flex-1 bg-gray-50 rounded-lg border border-dashed border-gray-300 overflow-hidden">
          {selectedActivity === 'tracing' ? (
            <div className="h-full w-full relative">
              <canvas
                ref={canvasRef}
                className="border rounded-lg w-full h-full bg-white"
              />
              
              {!currentContent && <div className="absolute inset-0" />}
            </div>
          ) : (
            <div className="h-full w-full relative">
              {generatedImage ? (
                <img
                  src={generatedImage}
                  alt="Generated coloring page"
                  className="w-full h-full object-contain bg-white"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-400">
                  <div className="text-center p-8">
                    <div className="bg-gray-100 dark:bg-gray-700/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-gray-600 dark:text-primary-300" />
                    </div>
                    <h3 className="text-2xl font-medium mb-3 text-gray-800 dark:text-gray-100">Generate a Coloring Page</h3>
                    <p className="text-base text-gray-600 dark:text-gray-400">Enter a description and click generate</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningStudio;
