import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Type, 
  Hash, 
  Download, 
  RotateCcw, 
  Sparkles, 
  Loader2, 
  PenTool, 
  PaintBucket, 
  ArrowRight, 
  BookOpen 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
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

const LearningStudio: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<ActivityType>('tracing');
  const [selectedTracing, setSelectedTracing] = useState<TracingOption>('letters');
  const [currentContent, setCurrentContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [showTutorial, setShowTutorial] = useState(true);
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
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
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

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to Learning Studio</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore fun learning activities designed for your little ones
          </p>
        </div>

        <Tabs 
          value={selectedActivity} 
          onValueChange={(value) => setSelectedActivity(value as ActivityType)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="tracing" className="flex items-center gap-2">
              <PenTool className="w-4 h-4" />
              Tracing
            </TabsTrigger>
            <TabsTrigger value="coloring" className="flex items-center gap-2">
              <PaintBucket className="w-4 h-4" />
              Coloring
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tracing" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Sidebar - Tracing Options */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tracing Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Category</h4>
                      <div className="grid grid-cols-3 gap-2">
                        <Button 
                          variant={selectedTracing === 'letters' ? 'default' : 'outline'} 
                          onClick={() => setSelectedTracing('letters')}
                          size="sm"
                          className="gap-1"
                        >
                          <Type className="w-3.5 h-3.5" />
                          Letters
                        </Button>
                        <Button 
                          variant={selectedTracing === 'numbers' ? 'default' : 'outline'} 
                          onClick={() => setSelectedTracing('numbers')}
                          size="sm"
                          className="gap-1"
                        >
                          <Hash className="w-3.5 h-3.5" />
                          Numbers
                        </Button>
                        <Button 
                          variant={selectedTracing === 'shapes' ? 'default' : 'outline'} 
                          onClick={() => setSelectedTracing('shapes')}
                          size="sm"
                          className="gap-1"
                        >
                          <span className="text-sm">◇</span>
                          Shapes
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-gray-800 dark:text-gray-100">Instructions</h3>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                  <li>• Select an activity from the menu</li>
                  <li>• Use your mouse or touch to draw</li>
                  <li>• Change colors and brush size</li>
                  <li>• Save your work when done</li>
                </ul>
              </div>
            </div>
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

  const handleGenerateColoringPage = async () => {
    try {
      setIsGenerating(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would be the response from your API
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
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
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
      
      <main className="flex-1 container py-8">
        <Tabs 
          value={selectedActivity} 
          onValueChange={(value) => setSelectedActivity(value as ActivityType)}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="tracing">Tracing</TabsTrigger>
            <TabsTrigger value="coloring">Coloring</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tracing">
            <Card>
              <CardHeader>
                <CardTitle>Tracing Activity</CardTitle>
                <CardDescription>
                  Practice tracing letters, numbers, and shapes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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
                    <Button 
                      variant={selectedTracing === 'shapes' ? 'default' : 'outline'}
                      onClick={() => setSelectedTracing('shapes')}
                    >
                      <PenTool className="mr-2 h-4 w-4" />
                      Shapes
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-white">
                    <canvas
                      ref={canvasRef}
                      className="w-full h-64 border rounded"
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
            </Card>
          </TabsContent>
          
          <TabsContent value="coloring">
            <Card>
              <CardHeader>
                <CardTitle>Coloring Activity</CardTitle>
                <CardDescription>
                  Generate coloring pages with AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Describe the coloring page you'd like to create..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleGenerateColoringPage}
                        disabled={isGenerating || !prompt.trim()}
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
                    <div className="border rounded-lg p-4 bg-white">
                      <img 
                        src={generatedImage} 
                        alt="Generated coloring page" 
                        className="w-full h-auto border rounded"
                      />
                      <div className="mt-4 flex justify-end">
                        <Button size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

      <main className="flex-1 container py-8">
        <Tabs 
          value={selectedActivity} 
          onValueChange={(value) => setSelectedActivity(value as ActivityType)}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="tracing">Tracing</TabsTrigger>
            <TabsTrigger value="coloring">Coloring</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tracing">
            <Card>
              <CardHeader>
                <CardTitle>Tracing Activity</CardTitle>
                <CardDescription>
                  Practice tracing letters, numbers, and shapes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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
                    <Button 
                      variant={selectedTracing === 'shapes' ? 'default' : 'outline'}
                      onClick={() => setSelectedTracing('shapes')}
                    >
                      <PenTool className="mr-2 h-4 w-4" />
                      Shapes
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-white">
                    <canvas
                      ref={canvasRef}
                      className="w-full h-64 border rounded"
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
            </Card>
          </TabsContent>
          
          <TabsContent value="coloring">
            <Card>
              <CardHeader>
                <CardTitle>Coloring Activity</CardTitle>
                <CardDescription>
                  Generate coloring pages with AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Describe the coloring page you'd like to create..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleGenerateColoringPage}
                        disabled={isGenerating || !prompt.trim()}
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
                    <div className="border rounded-lg p-4 bg-white">
                      <img 
                        src={generatedImage} 
                        alt="Generated coloring page" 
                        className="w-full h-auto border rounded"
                      />
                      <div className="mt-4 flex justify-end">
                        <Button size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default LearningStudio;
