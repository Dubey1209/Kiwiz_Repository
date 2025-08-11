import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Star, Crown, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BillingPlans = () => {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const { toast } = useToast();

  const plans = [
    {
      name: "Free Fun",
      description: "Perfect for trying out our platform",
      monthlyPrice: 0,
      yearlyPrice: 0,
      icon: Star,
      color: "from-cute-blue to-cute-purple",
      features: [
        "5 coloring pages per month",
        "Basic letter tracing (A-E)",
        "Upload 2 artworks",
        "View public gallery",
        "Basic support"
      ],
      limitations: [
        "Limited AI generations",
        "Watermarked downloads",
        "No priority support"
      ]
    },
    {
      name: "Little Explorer",
      description: "Great for regular learning and creativity",
      monthlyPrice: 9.99,
      yearlyPrice: 99.99,
      icon: Zap,
      color: "from-cute-purple to-cute-pink",
      popular: true,
      features: [
        "Unlimited coloring pages",
        "Full alphabet & number tracing",
        "Upload unlimited artworks",
        "AI artwork enhancement",
        "Private library storage",
        "Priority support",
        "Printable worksheets",
        "No watermarks"
      ],
      limitations: []
    },
    {
      name: "Creative Family",
      description: "Best for families with multiple children",
      monthlyPrice: 19.99,
      yearlyPrice: 199.99,
      icon: Crown,
      color: "from-cute-pink to-cute-yellow",
      features: [
        "Everything in Little Explorer",
        "Up to 4 child profiles",
        "Advanced AI features",
        "Custom coloring themes",
        "Family sharing gallery",
        "Progress tracking",
        "Educational insights",
        "Premium support",
        "Early access to new features"
      ],
      limitations: []
    }
  ];

  const faqs = [
    {
      question: "Is it safe for toddlers?",
      answer: "Absolutely! Our platform is designed specifically for ages 2-4 with child-safe content, no ads, and COPPA compliance."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period."
    },
    {
      question: "Do you offer family discounts?",
      answer: "Our Creative Family plan is designed for families with multiple children and offers the best value for larger families."
    },
    {
      question: "What devices are supported?",
      answer: "Our platform works on all modern devices - tablets, phones, and computers. Perfect for both home and on-the-go learning."
    },
    {
      question: "How does the AI artwork enhancement work?",
      answer: "Our AI safely enhances your child's artwork by improving colors, adding details, and creating beautiful illustrations while maintaining the original creativity."
    }
  ];

  const handleSubscribe = (planName: string, price: number) => {
    if (price === 0) {
      toast({
        title: "Free plan activated! 🎉",
        description: "You can now start exploring with our free features.",
      });
    } else {
      toast({
        title: "Redirecting to checkout...",
        description: `Setting up your ${planName} subscription.`,
      });
    }
  };

  const getSavings = (monthlyPrice: number, yearlyPrice: number) => {
    if (monthlyPrice === 0) return 0;
    const monthlyCost = monthlyPrice * 12;
    const savings = monthlyCost - yearlyPrice;
    return Math.round((savings / monthlyCost) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12 slide-up">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
            Choose Your Adventure!
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unlock the full potential of joyful learning with plans designed for every family's needs.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-card rounded-2xl p-2 shadow-lg border border-border">
            <Button
              variant={billingPeriod === "monthly" ? "default" : "ghost"}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                billingPeriod === "monthly" 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "hover:bg-secondary/50"
              }`}
              onClick={() => setBillingPeriod("monthly")}
            >
              Monthly
            </Button>
            <Button
              variant={billingPeriod === "yearly" ? "default" : "ghost"}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                billingPeriod === "yearly" 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "hover:bg-secondary/50"
              }`}
              onClick={() => setBillingPeriod("yearly")}
            >
              Yearly
              <Badge variant="secondary" className="ml-2 bg-cute-yellow/20 text-cute-yellow">
                Save up to 17%
              </Badge>
            </Button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const currentPrice = billingPeriod === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
            const savings = getSavings(plan.monthlyPrice, plan.yearlyPrice);
            
            return (
              <Card 
                key={plan.name} 
                className={`cute-card relative ${plan.popular ? 'ring-2 ring-primary scale-105' : ''} fade-in-delay`}
                style={{animationDelay: `${index * 0.2}s`}}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1 text-sm font-bold">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Plan Header */}
                  <div className="text-center space-y-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${plan.color} flex items-center justify-center mx-auto`}>
                      <plan.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                      <p className="text-muted-foreground">{plan.description}</p>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="text-center">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-foreground">
                        ${currentPrice}
                      </span>
                      {currentPrice > 0 && (
                        <span className="text-muted-foreground ml-1">
                          /{billingPeriod === "monthly" ? "month" : "year"}
                        </span>
                      )}
                    </div>
                    {billingPeriod === "yearly" && savings > 0 && (
                      <p className="text-sm text-cute-green font-semibold mt-1">
                        Save {savings}% with yearly billing
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-cute-green mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button 
                    className={`w-full h-12 text-lg ${plan.popular ? 'cute-button' : 'cute-button-secondary'}`}
                    onClick={() => handleSubscribe(plan.name, currentPrice)}
                  >
                    {currentPrice === 0 ? "Start Free" : "Choose Plan"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* FAQs */}
        <Card className="cute-card fade-in-delay">
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
            Frequently Asked Questions
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-start space-x-3">
                  <HelpCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">{faq.question}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Trust Indicators */}
        <div className="text-center mt-12 space-y-4">
          <div className="flex justify-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-cute-green rounded-full"></div>
              <span>Safe for kids</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-cute-blue rounded-full"></div>
              <span>COPPA compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-cute-purple rounded-full"></div>
              <span>No ads</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-cute-pink rounded-full"></div>
              <span>Cancel anytime</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            ✨ Join over 10,000 families who trust us with their child's learning journey
          </p>
        </div>
      </div>
    </div>
  );
};

export default BillingPlans;