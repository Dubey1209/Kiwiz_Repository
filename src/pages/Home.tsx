import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Palette, BookOpen, Upload, Star, Heart, Zap } from "lucide-react";
import { NavLink } from "react-router-dom";
import heroCharacter from "@/assets/hero-character.png";
import mascotLion from "@/assets/mascot-lion.png";
import educationIcons from "@/assets/education-icons.png";

const Home = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Interactive Letter & Number Tracing",
      description: "Help toddlers practice writing with guided tracing activities. Colorful letters and numbers with fun animations.",
      gradient: "from-cute-blue to-cute-purple"
    },
    {
      icon: Palette,
      title: "AI-Powered Coloring Pages",
      description: "Generate endless coloring pages instantly! Just describe what your child wants to color and watch the magic happen.",
      gradient: "from-cute-pink to-cute-yellow"
    },
    {
      icon: Upload,
      title: "Transform Your Child's Art",
      description: "Upload your toddler's artwork and see it transformed into beautiful, enhanced illustrations they'll love to share.",
      gradient: "from-cute-green to-cute-blue"
    }
  ];

  const steps = [
    {
      number: "1",
      title: "Choose Your Activity",
      description: "Select from tracing, coloring, or art transformation - each designed specifically for toddler development.",
      color: "cute-purple"
    },
    {
      number: "2", 
      title: "Create & Play",
      description: "Watch your little one engage with interactive content that builds fine motor skills and creativity.",
      color: "cute-yellow"
    },
    {
      number: "3",
      title: "Save & Share",
      description: "Keep all your child's digital creations in their personal library and share achievements with family.",
      color: "cute-pink"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background to-secondary/50 pt-12 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 slide-up">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Unlock Joyful
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent block">
                    Learning & Creativity
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Help your toddler recognize and practice letters and numbers while sparking their imagination with AI-powered creative tools designed just for little hands.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <NavLink to="/tracing">
                  <Button className="cute-button text-lg px-8 py-4">
                    Start Learning
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </NavLink>
                <NavLink to="/explore">
                  <Button 
                    variant="outline" 
                    className="text-lg px-8 py-4 border-2 border-primary/20 hover:border-primary/40 rounded-full transition-all duration-300 hover:scale-105"
                  >
                    Explore Gallery
                  </Button>
                </NavLink>
              </div>

              <div className="flex items-center space-x-6 pt-4">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div 
                        key={i} 
                        className="w-8 h-8 rounded-full bg-gradient-to-r from-cute-purple to-cute-pink border-2 border-white"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">10,000+ happy families</span>
                </div>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-cute-yellow text-cute-yellow" />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">4.9/5 rating</span>
                </div>
              </div>
            </div>

            <div className="relative lg:pl-12">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl"></div>
                <img 
                  src={heroCharacter} 
                  alt="Happy learning character" 
                  className="relative floating-animation w-full max-w-md mx-auto"
                />
              </div>
              
              {/* Floating elements */}
              <div className="absolute top-8 right-8 w-16 h-16 bg-cute-yellow rounded-full flex items-center justify-center floating-animation">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div className="absolute bottom-12 left-8 w-12 h-12 bg-cute-pink rounded-full flex items-center justify-center floating-animation" style={{animationDelay: '2s'}}>
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="absolute top-20 left-12 w-14 h-14 bg-cute-blue rounded-full flex items-center justify-center floating-animation" style={{animationDelay: '4s'}}>
                <Zap className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
              Where Little Minds Blossom
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Through playful activities and creative tools, your toddler will develop fine motor skills, letter recognition, and artistic confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="cute-card group cursor-pointer fade-in-delay" style={{animationDelay: `${index * 0.2}s`}}>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-r from-secondary/30 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple steps designed for toddlers and their caregivers to enjoy learning together.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center space-y-6 fade-in-delay" style={{animationDelay: `${index * 0.3}s`}}>
                <div className={`w-20 h-20 rounded-full bg-${step.color} flex items-center justify-center mx-auto shadow-lg hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl font-bold text-white">{step.number}</span>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="relative inline-block">
              <img 
                src={mascotLion} 
                alt="Cute mascot character" 
                className="w-24 h-24 mx-auto floating-animation"
              />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                Ready to Start the
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent block">
                  Learning Adventure?
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of families who are making learning fun, engaging, and memorable for their toddlers.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavLink to="/tracing">
                <Button className="cute-button text-lg px-8 py-4">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </NavLink>
              <NavLink to="/billing">
                <Button className="cute-button-secondary text-lg px-8 py-4">
                  View Plans
                </Button>
              </NavLink>
            </div>
            <p className="text-sm text-muted-foreground">
              ✨ No credit card required • Cancel anytime • Safe for kids
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;