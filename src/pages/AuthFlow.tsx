import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, User, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { NavLink } from "react-router-dom";
import ProfileForm, { ProfileData } from "@/components/auth/ProfileForm";
import EmailVerification from "@/components/auth/EmailVerification";
import PasswordSetup from "@/components/auth/PasswordSetup";

type AuthMethod = 'google' | 'apple' | 'email' | null;
type AuthFlowStep = 'method' | 'profile' | 'verification' | 'password' | 'complete';

const AuthFlow = () => {
  // Auth flow state
  const [flowStep, setFlowStep] = useState<AuthFlowStep>('method');
  const [authMethod, setAuthMethod] = useState<AuthMethod>(null);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tempProfileData, setTempProfileData] = useState<ProfileData | null>(null);
  const { toast } = useToast();

  // Handle authentication method selection
  const handleAuthMethod = async (method: AuthMethod) => {
    setAuthMethod(method);
    
    if (method === 'email') {
      // For email, we'll show the profile form with email and password fields
      setFlowStep('profile');
    } else if (method === 'google' || method === 'apple') {
      // For social auth, simulate successful auth and move to profile
      try {
        setIsLoading(true);
        // Here you would integrate with your actual auth provider
        // For now, we'll simulate a successful auth
        const userEmail = `${method}user@example.com`;
        setEmail(userEmail);
        setFlowStep('profile');
      } catch (error) {
        console.error('Authentication failed:', error);
        toast({
          title: "Authentication failed",
          description: `Could not sign in with ${method}. Please try again.`,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle profile completion
  const handleProfileComplete = async (profileData: ProfileData) => {
    setTempProfileData(profileData);
    
    if (authMethod === 'email') {
      // For email signup, update the email state and proceed to verification
      setEmail(profileData.email);
      setFlowStep('verification');
    } else {
      // For social auth, create account directly
      await createAccount(profileData);
    }
  };

  // Handle email verification
  const handleVerifyEmail = async (otp: string) => {
    try {
      setIsLoading(true);
      // Here you would verify the OTP with your backend
      // For demo purposes, we'll simulate a successful verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Move to password setup
      setFlowStep('password');
    } catch (error) {
      console.error('Verification failed:', error);
      toast({
        title: "Verification failed",
        description: "The verification code is invalid or has expired. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password setup
  const handlePasswordSetup = async (password: string) => {
    if (tempProfileData) {
      await createAccount({ ...tempProfileData, password });
    }
  };

  // Create account with profile data
  const createAccount = async (data: ProfileData & { password?: string }) => {
    try {
      setIsLoading(true);
      // Here you would send the data to your backend
      // For demo purposes, we'll simulate account creation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Account created successfully
      setFlowStep('complete');
      
      toast({
        title: "Account created successfully! ",
        description: "Welcome to our platform!",
      });
      
      // Here you would typically sign in the user and redirect
    } catch (error) {
      console.error('Account creation failed:', error);
      toast({
        title: "Account creation failed",
        description: "An error occurred while creating your account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend verification code
  const handleResendCode = async () => {
    try {
      // Here you would call your API to resend the verification code
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error('Failed to resend code:', error);
      return false;
    }
  };

  // Render the current step
  const renderStep = () => {
    switch (flowStep) {
      case 'method':
        return (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-2xl">✦</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground">
                Create Your Account
              </h1>
              <p className="text-muted-foreground">
                Join thousands of families making learning fun
              </p>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-12 border-2 hover:border-primary/40 hover:bg-secondary/50 transition-all duration-300"
                onClick={() => handleAuthMethod('google')}
                disabled={isLoading}
              >
                <div className="w-5 h-5 mr-3 bg-gradient-to-r from-red-500 to-yellow-500 rounded"></div>
                Continue with Google
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 border-2 hover:border-primary/40 hover:bg-secondary/50 transition-all duration-300"
                onClick={() => handleAuthMethod('apple')}
                disabled={isLoading}
              >
                <div className="w-5 h-5 mr-3 bg-gradient-to-r from-gray-800 to-gray-600 rounded"></div>
                Continue with Apple
              </Button>
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <Button
                variant="default"
                className="w-full h-12"
                onClick={() => handleAuthMethod('email')}
                disabled={isLoading}
              >
                <Mail className="w-4 h-4 mr-2" />
                Continue with Email
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <NavLink to="/login" className="text-primary hover:underline">
                Sign in
              </NavLink>
            </p>
          </div>
        );

      case 'profile':
        return (
          <ProfileForm
            email={email}
            authMethod={authMethod || 'email'}
            onComplete={handleProfileComplete}
            onBack={() => setFlowStep('method')}
          />
        );

      case 'verification':
        return (
          <EmailVerification
            email={email}
            onVerify={handleVerifyEmail}
            onResend={handleResendCode}
            onBack={() => setFlowStep('profile')}
          />
        );

      case 'password':
        return (
          <PasswordSetup
            email={email}
            onSubmit={handlePasswordSetup}
            onBack={() => setFlowStep('verification')}
          />
        );

      case 'complete':
        return (
          <div className="text-center space-y-6 py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Account Created Successfully!</h2>
            <p className="text-muted-foreground">
              Welcome to our platform! Your account has been created and you're now signed in.
            </p>
            <Button asChild className="w-full">
              <NavLink to="/">
                Go to Dashboard
              </NavLink>
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 pt-8 pb-16">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back to Home */}
        <NavLink 
          to="/" 
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </NavLink>

        <Card className="cute-card slide-up p-8">
          {renderStep()}
          
          <div className="mt-8 text-center space-y-4">
            <p className="text-xs text-muted-foreground">
              By continuing, you agree to our{" "}
              <a href="#" className="text-primary hover:underline">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AuthFlow;