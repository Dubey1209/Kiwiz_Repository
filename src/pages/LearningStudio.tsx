import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, X, Type, Hash, Image as ImageIcon, Download, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type ActivityType = 'tracing' | 'coloring';
type TracingOption = 'letters' | 'numbers' | 'shapes';

const LearningStudio = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityType>('tracing');
  const [selectedTracing, setSelectedTracing] = useState<TracingOption>('letters');
  const [currentContent, setCurrentContent] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [isPainting, setIsPainting] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

  // Initialize canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    
    setCtx(context);
    
    // Set canvas size
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      
      // Redraw content if any
      if (currentContent) {
        drawContent();
      }
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [currentContent]);

  const drawContent = () => {
    if (!ctx || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (selectedActivity === 'tracing' && currentContent) {
      ctx.font = '200px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#e5e7eb';
      ctx.fillText(currentContent, canvas.width / 2, canvas.height / 2);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!ctx) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsPainting(true);
    setLastPosition({ x, y });
    
    // Start a new path
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPainting || !ctx || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Draw line
    ctx.lineTo(x, y);
    ctx.stroke();
    
    // Draw a circle at the current position for better visual
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Start a new path for the next line segment
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    setLastPosition({ x, y });
  };

  const stopDrawing = () => {
    setIsPainting(false);
  };

  const clearCanvas = () => {
    if (!ctx || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Redraw the content if it exists
    if (currentContent) {
      drawContent();
    }
  };

  const downloadCanvas = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = `${selectedActivity}-${new Date().getTime()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
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
            className="flex items-center justify-center text-4xl p-4 border rounded-lg hover:bg-gray-100 transition-colors"
          >
            {item}
          </button>
        ))}
      </div>
    );
  };

  const renderColoringOptions = () => {
    const colors = [
      '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', 
      '#ffff00', '#00ffff', '#ff00ff', '#ff9900', '#9900ff'
    ];
    
    return (
      <div className="p-4">
        <div className="grid grid-cols-5 gap-4 mb-4">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className="w-12 h-12 rounded-full border-2 border-gray-200"
              style={{ backgroundColor: c }}
              aria-label={`Color ${c}`}
            />
          ))}
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brush Size: {brushSize}px
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Learning Studio</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={clearCanvas}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear
          </Button>
          <Button onClick={downloadCanvas}>
            <Download className="w-4 h-4 mr-2" />
            Save
          </Button>
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
                placeholder="Search or create..."
                className="pl-10 pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowOptions(true)}
              />
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showOptions ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              </button>
            </div>
            
            <AnimatePresence>
              {showOptions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
                >
                  <Tabs 
                    defaultValue="tracing" 
                    className="w-full"
                    onValueChange={(value) => setSelectedActivity(value as ActivityType)}
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="tracing">Tracing</TabsTrigger>
                      <TabsTrigger value="coloring">Coloring</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="tracing" className="m-0">
                      <div className="p-2 border-t">
                        <div className="grid grid-cols-3 gap-1 mb-2">
                          <Button 
                            variant={selectedTracing === 'letters' ? 'default' : 'ghost'} 
                            size="sm"
                            onClick={() => setSelectedTracing('letters')}
                            className="text-xs"
                          >
                            <Type className="w-3 h-3 mr-1" />
                            Letters
                          </Button>
                          <Button 
                            variant={selectedTracing === 'numbers' ? 'default' : 'ghost'} 
                            size="sm"
                            onClick={() => setSelectedTracing('numbers')}
                            className="text-xs"
                          >
                            <Hash className="w-3 h-3 mr-1" />
                            Numbers
                          </Button>
                          <Button 
                            variant={selectedTracing === 'shapes' ? 'default' : 'ghost'} 
                            size="sm"
                            onClick={() => setSelectedTracing('shapes')}
                            className="text-xs"
                          >
                            <ImageIcon className="w-3 h-3 mr-1" />
                            Shapes
                          </Button>
                        </div>
                        {renderTracingOptions()}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="coloring" className="m-0">
                      <div className="p-2 border-t">
                        {renderColoringOptions()}
                      </div>
                    </TabsContent>
                  </Tabs>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Instructions</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Select an activity from the menu</li>
              <li>• Use your mouse or touch to draw</li>
              <li>• Change colors and brush size</li>
              <li>• Save your work when done</li>
            </ul>
          </div>
        </div>
        
        {/* Canvas Area */}
        <div className="flex-1 bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="h-full w-full relative">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="w-full h-full cursor-crosshair"
            />
            
            {!currentContent && selectedActivity === 'tracing' && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <div className="text-center p-8">
                  <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8" />
                  </div>
                  <h3 className="font-medium">Select something to trace</h3>
                  <p className="text-sm mt-1">Choose from the menu to get started</p>
                </div>
              </div>
            )}
            
            {selectedActivity === 'coloring' && (
              <div className="absolute bottom-4 right-4 flex items-center space-x-2 bg-white/90 px-3 py-2 rounded-full shadow-md">
                <div 
                  className="w-6 h-6 rounded-full border" 
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm font-medium">{color.toUpperCase()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningStudio;
