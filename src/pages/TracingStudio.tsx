import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Printer, Download, RotateCcw, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TracingStudio = () => {
  const [activeCategory, setActiveCategory] = useState("alphabet");
  const [selectedItem, setSelectedItem] = useState("A");
  const { toast } = useToast();

  const categories = [
    { id: "alphabet", name: "Alphabet", count: 26 },
    { id: "numbers", name: "Numbers", count: 10 },
  ];

  const alphabetItems = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const numberItems = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  const getCurrentItems = () => {
    return activeCategory === "alphabet" ? alphabetItems : numberItems;
  };

  const handlePrint = () => {
    window.print();
    toast({
      title: "Print Started",
      description: "Your tracing worksheet is being prepared for printing!",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your tracing worksheet is downloading as PDF!",
    });
  };

  const handlePlaySound = () => {
    toast({
      title: "Playing Sound",
      description: `Listen to the pronunciation of "${selectedItem}"`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12 slide-up">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
            Alphabet & Number Tracing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Help your toddler practice writing letters and numbers with our interactive tracing studio.
          </p>
        </div>

        {/* Category Selection */}
        <div className="flex justify-center mb-8">
          <div className="bg-card rounded-2xl p-2 shadow-lg border border-border">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "ghost"}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeCategory === category.id 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "hover:bg-secondary/50"
                }`}
                onClick={() => {
                  setActiveCategory(category.id);
                  setSelectedItem(category.id === "alphabet" ? "A" : "1");
                }}
              >
                {category.name}
                <Badge variant="secondary" className="ml-2">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Item Selection Grid */}
          <div className="lg:col-span-1">
            <Card className="cute-card">
              <h3 className="text-lg font-bold text-foreground mb-4">
                Choose Your {activeCategory === "alphabet" ? "Letter" : "Number"}
              </h3>
              <div className="grid grid-cols-6 gap-2">
                {getCurrentItems().map((item) => (
                  <Button
                    key={item}
                    variant={selectedItem === item ? "default" : "outline"}
                    className={`aspect-square text-lg font-bold rounded-xl transition-all duration-300 ${
                      selectedItem === item
                        ? "bg-primary text-primary-foreground scale-110 shadow-lg"
                        : "hover:scale-105 hover:bg-secondary/50"
                    }`}
                    onClick={() => setSelectedItem(item)}
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </Card>
          </div>

          {/* Tracing Area */}
          <div className="lg:col-span-2">
            <Card className="cute-card h-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-foreground">
                  Practice Writing: {selectedItem}
                </h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full"
                    onClick={handlePlaySound}
                  >
                    <Volume2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full"
                    onClick={() => setSelectedItem(selectedItem)}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Large Tracing Display */}
              <div className="bg-gradient-to-br from-secondary/20 to-background border-2 border-dashed border-primary/30 rounded-2xl p-12 text-center mb-6">
                <div className="text-9xl font-bold text-primary/30 mb-4 select-none">
                  {selectedItem}
                </div>
                <p className="text-muted-foreground">
                  Trace over the dotted {activeCategory === "alphabet" ? "letter" : "number"} with your finger or stylus
                </p>
              </div>

              {/* Practice Lines */}
              <div className="space-y-4 mb-6">
                <h4 className="text-lg font-semibold text-foreground">Practice Lines</h4>
                {[1, 2, 3].map((line) => (
                  <div key={line} className="flex items-center space-x-4 p-4 bg-secondary/20 rounded-xl">
                    <span className="text-sm text-muted-foreground w-8">{line}.</span>
                    <div className="flex-1 border-b-2 border-dashed border-primary/40 h-12 flex items-center">
                      <div className="text-4xl font-bold text-primary/40 pl-4">
                        {selectedItem}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button className="cute-button flex-1 min-w-[120px]" onClick={handlePrint}>
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button className="cute-button-secondary flex-1 min-w-[120px]" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Tips Section */}
        <Card className="cute-card mt-8 fade-in-delay">
          <h3 className="text-xl font-bold text-foreground mb-4">✨ Tracing Tips for Parents</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Getting Started</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Start with letters your child knows well</li>
                <li>• Use thick crayons or markers for easier grip</li>
                <li>• Practice for short 10-15 minute sessions</li>
                <li>• Encourage them to say the letter sound aloud</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Making it Fun</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Celebrate each completed letter with praise</li>
                <li>• Create stories about each letter's shape</li>
                <li>• Use different colors for different letters</li>
                <li>• Display completed work on the refrigerator</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TracingStudio;