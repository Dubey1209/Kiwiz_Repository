import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Star, Crown, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { NavLink } from "react-router-dom";

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
      color: "from-blue-400 to-purple-500",
      features: [
        "5 coloring pages per month",
        "Basic letter tracing (A-E)",
        "Upload 2 artworks",
        "View public gallery",
        "Basic support"
      ],
      buttonVariant: "outline"
    },
    {
      name: "Little Explorer",
      description: "Great for regular learning and creativity",
      monthlyPrice: 9.99,
      yearlyPrice: 99.99,
      icon: Zap,
      color: "from-purple-500 to-pink-500",
      popular: true,
      features: [
        "Unlimited coloring pages",
        "Full alphabet & number tracing",
        "Upload unlimited artworks",
        "AI artwork enhancement",
        "Private library storage",
        "Priority support"
      ],
      buttonVariant: "default"
    },
    {
      name: "Creative Family",
      description: "Best for families with multiple children",
      monthlyPrice: 19.99,
      yearlyPrice: 199.99,
      icon: Crown,
      color: "from-pink-500 to-yellow-400",
      features: [
        "Everything in Little Explorer",
        "Up to 4 child profiles",
        "Advanced AI features",
        "Custom coloring themes",
        "Family sharing gallery",
        "Premium support"
      ],
      buttonVariant: "outline"
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
    }
  ];

  const handleSubscribe = (planName: string, price: number) => {
    if (price === 0) {
      toast({
        title: "Free plan activated! ",
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
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the perfect plan for your child's learning journey
          </p>
          
          {/* Billing Toggle */}
          <div className="flex justify-center mt-8">
            <div className="bg-card rounded-xl p-1.5 border border-border">
              <Button
                variant={billingPeriod === "monthly" ? "default" : "ghost"}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  billingPeriod === "monthly" ? "shadow-sm" : ""
                }`}
                onClick={() => setBillingPeriod("monthly")}
              >
                Monthly
              </Button>
              <Button
                variant={billingPeriod === "yearly" ? "default" : "ghost"}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  billingPeriod === "yearly" ? "shadow-sm" : ""
                }`}
                onClick={() => setBillingPeriod("yearly")}
              >
                Yearly
                <Badge variant="secondary" className="ml-2 bg-cute-yellow/20 text-cute-yellow hover:bg-cute-yellow/30">
                  Save 17%
                </Badge>
              </Button>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => {
            const currentPrice = billingPeriod === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
            const savings = getSavings(plan.monthlyPrice, plan.yearlyPrice);
            
            return (
              <div key={plan.name} className="relative">
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-cute-pink to-cute-purple text-white px-4 py-1 text-xs font-bold shadow-md">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <Card className={`h-full overflow-hidden transition-all duration-300 ${
                  plan.popular 
                    ? 'border-2 border-primary shadow-lg scale-[1.02]' 
                    : 'border border-border hover:border-primary/50 hover:shadow-md'
                }`}>
                  <div className="p-6 h-full flex flex-col">
                    <div className="mb-6">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${plan.color} flex items-center justify-center mb-4`}>
                        <plan.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-1">{plan.name}</h3>
                      <p className="text-muted-foreground text-sm">{plan.description}</p>
                    </div>

                    <div className="my-6">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-foreground">
                          ${currentPrice.toFixed(2)}
                        </span>
                        {currentPrice > 0 && (
                          <span className="text-muted-foreground ml-2">
                            /{billingPeriod === "monthly" ? "month" : "year"}
                          </span>
                        )}
                      </div>
                      {billingPeriod === "yearly" && savings > 0 && (
                        <p className="text-sm text-green-500 mt-1">
                          Save {savings}% with yearly billing
                        </p>
                      )}
                    </div>

                    <div className="space-y-3 mb-8 flex-grow">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start space-x-2">
                          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button 
                      variant={plan.buttonVariant as any}
                      className={`w-full py-5 text-base font-medium rounded-xl ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-cute-pink to-cute-purple hover:opacity-90 text-white' 
                          : 'hover:bg-accent hover:text-accent-foreground'
                      }`}
                      onClick={() => handleSubscribe(plan.name, currentPrice)}
                    >
                      {currentPrice === 0 ? "Get Started" : "Choose Plan"}
                    </Button>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-cute-blue/10 to-cute-purple/10 rounded-2xl p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to unlock your child's creativity?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Join thousands of parents who are helping their children learn and grow with our interactive platform.
          </p>
          <div className="flex justify-center">
            <NavLink to="/studio">
              <Button className="cute-button">
                Start Your Free Trial
              </Button>
            </NavLink>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-6">TRUSTED BY FAMILIES WORLDWIDE</p>
          <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-cute-green"></div>
              <span>Safe for kids</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-cute-blue"></div>
              <span>COPPA compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-cute-purple"></div>
              <span>No ads</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-cute-pink"></div>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPlans;