import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Image, Wand2, Download, Share2, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const UploadIllustrate = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedImage(e.target?.result as string);
          setEnhancedImage(null);
        };
        reader.readAsDataURL(file);
        toast({
          title: "Image uploaded successfully! 📸",
          description: "Now you can enhance your child's artwork.",
        });
      } else {
        toast({
          title: "Please select an image file",
          description: "Only JPG, PNG, and GIF files are supported.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setEnhancedImage(null);
      };
      reader.readAsDataURL(file);
      toast({
        title: "Image uploaded successfully! 📸",
        description: "Now you can enhance your child's artwork.",
      });
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleEnhance = async () => {
    if (!uploadedImage) return;
    
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setEnhancedImage(`https://picsum.photos/400/400?random=${Date.now()}`);
      setIsProcessing(false);
      toast({
        title: "Enhancement complete! ✨",
        description: "Your child's artwork has been beautifully enhanced!",
      });
    }, 4000);
  };

  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "The enhanced artwork is downloading now!",
    });
  };

  const handleSave = () => {
    toast({
      title: "Saved to library! ❤️",
      description: "The enhanced artwork has been added to your library.",
    });
  };

  const handleShare = () => {
    toast({
      title: "Link copied! 📋",
      description: "Share this beautiful artwork with friends and family.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 pt-8 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12 slide-up">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
            Share Your Child's Art
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload your toddler's artwork and watch our AI transform it into a beautiful, enhanced illustration they'll be proud to share!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="cute-card">
            <h3 className="text-xl font-bold text-foreground mb-6">📸 Upload Your Child's Art</h3>
            
            {!uploadedImage ? (
              <div
                className="border-2 border-dashed border-primary/30 rounded-2xl p-12 text-center space-y-6 transition-all duration-300 hover:border-primary/50 hover:bg-secondary/20 cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-20 h-20 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-10 h-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-foreground">
                    Drag & drop an image here
                  </h4>
                  <p className="text-muted-foreground">
                    or click to browse from your device
                  </p>
                </div>
                <Button className="cute-button">
                  <Image className="w-4 h-4 mr-2" />
                  Choose Image
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={uploadedImage}
                    alt="Uploaded artwork"
                    className="w-full h-64 object-cover rounded-2xl shadow-lg"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm rounded-full"
                    onClick={() => {
                      setUploadedImage(null);
                      setEnhancedImage(null);
                    }}
                  >
                    Change Image
                  </Button>
                </div>
                
                <Button 
                  className="cute-button w-full" 
                  onClick={handleEnhance}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enhancing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Enhance with AI
                    </>
                  )}
                </Button>
              </div>
            )}
          </Card>

          {/* Enhanced Result Section */}
          <Card className="cute-card">
            <h3 className="text-xl font-bold text-foreground mb-6">✨ AI Enhanced Result</h3>
            
            {!uploadedImage ? (
              <div className="h-64 bg-gradient-to-br from-secondary/20 to-primary/10 rounded-2xl flex items-center justify-center border-2 border-dashed border-primary/20">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                    <Wand2 className="w-8 h-8 text-primary/60" />
                  </div>
                  <p className="text-muted-foreground">
                    Upload an image to see the magic happen!
                  </p>
                </div>
              </div>
            ) : isProcessing ? (
              <div className="h-64 bg-gradient-to-br from-secondary/20 to-primary/10 rounded-2xl flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground">
                    Our AI is working its magic...
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Enhancing colors, details, and making it extra special!
                  </p>
                </div>
              </div>
            ) : enhancedImage ? (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={enhancedImage}
                    alt="Enhanced artwork"
                    className="w-full h-64 object-cover rounded-2xl shadow-lg border-4 border-gradient-to-r from-primary/20 to-accent/20"
                  />
                  <div className="absolute top-3 left-3 bg-success text-success-foreground px-3 py-1 rounded-full text-sm font-semibold">
                    Enhanced!
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Button className="cute-button flex-1" onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button 
                    variant="outline" 
                    className="rounded-full border-2 hover:border-primary/40"
                    onClick={handleSave}
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="rounded-full border-2 hover:border-primary/40"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-64 bg-gradient-to-br from-secondary/20 to-primary/10 rounded-2xl flex items-center justify-center border-2 border-dashed border-primary/20">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
                    <Image className="w-8 h-8 text-accent/60" />
                  </div>
                  <p className="text-muted-foreground">
                    Click "Enhance with AI" to see the transformation!
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="cute-card mt-8 fade-in-delay">
          <h3 className="text-xl font-bold text-foreground mb-4">📝 Tips for Best Results</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Photo Quality</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Use good lighting when photographing</li>
                <li>• Make sure the artwork fills the frame</li>
                <li>• Avoid shadows and glare</li>
                <li>• Keep the image straight and clear</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Best Artwork Types</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Drawings with clear lines</li>
                <li>• Colorful crayon or marker art</li>
                <li>• Simple shapes and figures</li>
                <li>• Pictures with bright colors</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Sharing Tips</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Create a digital art portfolio</li>
                <li>• Share with grandparents and family</li>
                <li>• Print enhanced versions as gifts</li>
                <li>• Save originals in your library</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UploadIllustrate;