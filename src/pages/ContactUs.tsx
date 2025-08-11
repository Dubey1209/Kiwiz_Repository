import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, MessageCircle, Phone, MapPin, Send, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const categories = [
    { value: "support", label: "Technical Support" },
    { value: "billing", label: "Billing & Subscriptions" },
    { value: "feature", label: "Feature Request" },
    { value: "feedback", label: "General Feedback" },
    { value: "partnership", label: "Partnership Inquiry" },
    { value: "other", label: "Other" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message sent successfully! 🎉",
        description: "We'll get back to you within 24 hours.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "",
        message: ""
      });
    }, 2000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 pt-8 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12 slide-up">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
            Get in Touch With Us!
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions, feedback, or need help? We'd love to hear from you and help make your child's learning experience even better.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="cute-card">
            <h3 className="text-2xl font-bold text-foreground mb-6">Send us a message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-semibold text-foreground">
                    Your Name *
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="cute-input"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-foreground">
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="cute-input"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-semibold text-foreground">
                  Category *
                </label>
                <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                  <SelectTrigger className="cute-input">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-semibold text-foreground">
                  Subject *
                </label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="Brief description of your inquiry"
                  value={formData.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  className="cute-input"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-semibold text-foreground">
                  Message *
                </label>
                <Textarea
                  id="message"
                  placeholder="Tell us more about your question or feedback..."
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  className="cute-input min-h-[120px] resize-none"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="cute-button w-full h-12 text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <Card className="cute-card">
              <h3 className="text-xl font-bold text-foreground mb-6">Other ways to reach us</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-cute-blue to-cute-purple flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Email Support</h4>
                    <p className="text-muted-foreground text-sm mb-2">Get help via email</p>
                    <a href="mailto:support@lingo.com" className="text-primary hover:underline font-medium">
                      support@lingo.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-cute-purple to-cute-pink flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Live Chat</h4>
                    <p className="text-muted-foreground text-sm mb-2">Mon-Fri, 9 AM - 6 PM EST</p>
                    <Button variant="outline" size="sm" className="rounded-full">
                      Start Chat
                    </Button>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-cute-pink to-cute-yellow flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Phone Support</h4>
                    <p className="text-muted-foreground text-sm mb-2">For urgent issues</p>
                    <a href="tel:+1234567890" className="text-primary hover:underline font-medium">
                      +1 (234) 567-890
                    </a>
                  </div>
                </div>
              </div>
            </Card>

            {/* Office Location */}
            <Card className="cute-card">
              <h3 className="text-xl font-bold text-foreground mb-6">Visit our office</h3>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-cute-green to-cute-blue flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Main Office</h4>
                  <p className="text-muted-foreground text-sm">
                    123 Learning Street<br />
                    Education District<br />
                    San Francisco, CA 94102<br />
                    United States
                  </p>
                </div>
              </div>
            </Card>

            {/* Response Time */}
            <Card className="cute-card">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-cute-yellow to-cute-green flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">We're here to help!</h4>
                  <p className="text-muted-foreground text-sm">
                    Our dedicated support team typically responds within 24 hours. 
                    For urgent technical issues, we aim to respond within 4 hours during business days.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="cute-card mt-16 fade-in-delay">
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
            Quick Answers to Common Questions
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">How do I reset my password?</h4>
                <p className="text-sm text-muted-foreground">
                  Go to the sign-in page and click "Forgot Password?" to receive reset instructions via email.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">Is my child's data safe?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes! We're COPPA compliant and use industry-standard encryption to protect all data.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">Can I cancel my subscription?</h4>
                <p className="text-sm text-muted-foreground">
                  Absolutely! You can cancel anytime from your account settings or by contacting support.
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">What devices are supported?</h4>
                <p className="text-sm text-muted-foreground">
                  Our platform works on tablets, phones, and computers with modern web browsers.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">Do you offer refunds?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, we offer a 30-day money-back guarantee for all paid subscriptions.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">How do I upgrade my plan?</h4>
                <p className="text-sm text-muted-foreground">
                  Visit the billing section in your account to upgrade or change your subscription plan.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ContactUs;