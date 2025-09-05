import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Type, Hash, Download, RotateCcw, Sparkles, Loader2, PenTool, PaintBucket, ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

type ActivityType = 'tracing' | 'coloring';
type TracingOption = 'letters' | 'numbers' | 'shapes';

const LearningStudio = () => {
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
    'Princess in a magical castle'
  ];

  // Initialize canvas
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
  };

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Simulate API call
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
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => handleTracingSelect(item)}
            className={`flex items-center justify-center text-4xl p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors ${
              currentContent === item ? 'bg-primary/10 border-primary' : ''
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to Learning Studio</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore fun learning activities designed for your little ones
          </p>
        </div>

        {showTutorial && (
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-xl">🎨 How to use Learning Studio</CardTitle>
              <CardDescription>
                Get started with these simple steps
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                  1
                </div>
                <div>
                  <h4 className="font-medium">Choose an Activity</h4>
                  <p className="text-sm text-muted-foreground">Select between Tracing or Coloring</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                  2
                </div>
                <div>
                  <h4 className="font-medium">Customize</h4>
                  <p className="text-sm text-muted-foreground">Pick letters, numbers, or describe your coloring page</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                  3
                </div>
                <div>
                  <h4 className="font-medium">Start Creating</h4>
                  <p className="text-sm text-muted-foreground">Trace letters or color your custom creation</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => setShowTutorial(false)}>
                Got it, thanks!
              </Button>
            </CardFooter>
          </Card>
        )}

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
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-3">
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle>
                      {currentContent ? `Trace: ${currentContent}` : 'Select an item to start tracing'}
                    </CardTitle>
                    <CardDescription>
                      {currentContent ? 'Use your finger or mouse to trace the outline' : 'Choose from the options on the left'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
                    {currentContent ? (
                      <div className="relative w-full h-full max-w-2xl mx-auto">
                        <canvas
                          ref={canvasRef}
                          className="absolute inset-0 w-full h-full bg-white dark:bg-gray-900 rounded-md shadow-sm"
                        />
                      </div>
                    ) : (
                      <div className="text-center p-8 max-w-sm">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                          <PenTool className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="font-medium text-lg mb-2">Nothing selected yet</h3>
                        <p className="text-sm text-muted-foreground">
                          Choose a {selectedTracing === 'letters' ? 'letter' : selectedTracing === 'numbers' ? 'number' : 'shape'} 
                          from the left panel to start tracing practice.
                        </p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={clearCanvas}
                      disabled={!currentContent}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={downloadCanvas}
                      disabled={!currentContent}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="coloring" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Create Coloring Page</CardTitle>
                    <CardDescription>Describe what you want to color</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Textarea
                        id="prompt"
                        placeholder="e.g., A happy dinosaur with a party hat"
                        className="min-h-[120px]"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Be as descriptive as possible for best results
                      </p>
                    </div>

                    <Button 
                      className="w-full" 
                      onClick={generateImage}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Coloring Page
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Quick Ideas</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setPrompt(predefinedPrompts[Math.floor(Math.random() * predefinedPrompts.length)])}
                      >
                        Random
                      </Button>
                    </div>
                    <CardDescription>Try these fun ideas to get started</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {predefinedPrompts.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start text-left h-auto py-2 text-sm font-normal"
                        onClick={() => setPrompt(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-3">
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle>
                      {generatedImage ? 'Your Coloring Page' : 'AI-Generated Coloring Page'}
                    </CardTitle>
                    <CardDescription>
                      {generatedImage 
                        ? 'Print or download your custom coloring page' 
                        : 'Enter a description and click "Generate" to create a custom coloring page'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
                    {generatedImage ? (
                      <div className="w-full max-w-2xl">
                        <img 
                          src={generatedImage} 
                          alt="Generated coloring page" 
                          className="w-full h-auto rounded-md shadow-sm border border-gray-200 dark:border-gray-700"
                        />
                        <div className="mt-6 flex justify-center gap-4">
                          <Button variant="outline" onClick={() => window.print()}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <Button>
                            <span className="mr-2">🖨️</span>
                            Print
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-8 max-w-sm">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 mb-4">
                          <PaintBucket className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="font-medium text-lg mb-2">No coloring page yet</h3>
                        <p className="text-sm text-muted-foreground">
                          Describe what you'd like to color and click "Generate" to create your custom coloring page.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LearningStudio;
