import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Wand2, Download, Heart, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ColoringGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const popularPrompts = [
    { text: "Cute cat", icon: "🐱" },
    { text: "Happy dog", icon: "🐶" },
    { text: "Rainbow unicorn", icon: "🦄" },
    { text: "Beautiful butterfly", icon: "🦋" },
    { text: "Friendly dinosaur", icon: "🦕" },
    { text: "Magical castle", icon: "🏰" },
    { text: "Smiling sun", icon: "☀️" },
    { text: "Flying airplane", icon: "✈️" },
    { text: "Colorful flower", icon: "🌸" },
    { text: "Swimming fish", icon: "🐠" },
    { text: "Big truck", icon: "🚛" },
    { text: "Cute bunny", icon: "🐰" },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a prompt",
        description: "Tell us what you'd like to color!",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      setGeneratedImage(`https://picsum.photos/400/400?random=${Date.now()}`);
      setIsGenerating(false);
      toast({
        title: "Coloring page ready! 🎨",
        description: "Your custom coloring page has been generated successfully!",
      });
    }, 3000);
  };

  const handlePopularPrompt = (promptText: string) => {
    setPrompt(promptText);
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your coloring page is downloading now!",
    });
  };

  const handleLike = () => {
    toast({
      title: "Added to favorites! ❤️",
      description: "This coloring page has been saved to your library.",
    });
  };

  const handleShare = () => {
    toast({
      title: "Link copied! 📋",
      description: "Share this coloring page with friends and family.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 pt-8 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12 slide-up">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
            Generate Your Coloring Page
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Describe what your little one wants to color, and watch our AI create a perfect coloring page just for them!
          </p>
        </div>

        {/* Generator Card */}
        <Card className="cute-card mb-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="prompt" className="block text-lg font-semibold text-foreground mb-3">
                What would you like to color today?
              </label>
              <div className="flex gap-3">
                <Input
                  id="prompt"
                  type="text"
                  placeholder="E.g., A friendly dragon playing with balloons..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="cute-input text-lg flex-1"
                  onKeyPress={(e) => e.key === "Enter" && handleGenerate()}
                />
                <Button 
                  className="cute-button px-8"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Popular Prompts */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">🌟 Popular Ideas</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {popularPrompts.map((item, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start h-auto p-3 rounded-xl border-2 hover:border-primary/40 hover:bg-secondary/50 transition-all duration-300 hover:scale-105"
                    onClick={() => handlePopularPrompt(item.text)}
                  >
                    <span className="text-lg mr-2">{item.icon}</span>
                    <span className="text-sm font-medium">{item.text}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Generated Image Display */}
        {(isGenerating || generatedImage) && (
          <Card className="cute-card">
            <div className="text-center space-y-6">
              <h3 className="text-xl font-bold text-foreground">
                {isGenerating ? "Creating your coloring page..." : "Your coloring page is ready! 🎨"}
              </h3>
              
              <div className="relative inline-block">
                {isGenerating ? (
                  <div className="w-96 h-96 bg-gradient-to-br from-secondary/20 to-primary/10 rounded-2xl flex items-center justify-center border-2 border-dashed border-primary/30">
                    <div className="text-center space-y-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                      <p className="text-muted-foreground">Our AI is drawing something amazing...</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <img 
                      src={generatedImage!} 
                      alt="Generated coloring page" 
                      className="w-96 h-96 object-cover rounded-2xl shadow-lg border-4 border-white"
                    />
                    <Badge className="absolute top-3 right-3 bg-success text-success-foreground">
                      Ready to Color!
                    </Badge>
                  </div>
                )}
              </div>

              {!isGenerating && generatedImage && (
                <div className="flex flex-wrap justify-center gap-3">
                  <Button className="cute-button" onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button 
                    variant="outline" 
                    className="rounded-full border-2 hover:border-primary/40 hover:bg-secondary/50"
                    onClick={handleLike}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Save to Library
                  </Button>
                  <Button 
                    variant="outline" 
                    className="rounded-full border-2 hover:border-primary/40 hover:bg-secondary/50"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Instructions */}
        <Card className="cute-card mt-8 fade-in-delay">
          <h3 className="text-xl font-bold text-foreground mb-4">💡 How to get the best results</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Good prompts include:</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Simple, clear descriptions</li>
                <li>• Friendly, happy characters</li>
                <li>• Basic shapes and objects</li>
                <li>• Animals your child loves</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Tips for toddlers:</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Use thick crayons or markers</li>
                <li>• Start with bigger areas first</li>
                <li>• Encourage creativity with colors</li>
                <li>• Take breaks when needed</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ColoringGenerator;