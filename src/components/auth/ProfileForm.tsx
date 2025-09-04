import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface ProfileFormProps {
  email: string;
  authMethod: 'google' | 'apple' | 'email';
  onComplete: (profileData: ProfileData) => void;
  onBack: () => void;
}

export interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  kidAge: string;
  kidGender: string;
  state: string;
  country: string;
}

const ProfileForm = ({ email, authMethod, onComplete, onBack }: ProfileFormProps) => {
  const [formData, setFormData] = useState<Omit<ProfileData, 'kidAge' | 'email' | 'password'>>({
    firstName: '',
    lastName: '',
    kidGender: '',
    state: '',
    country: '',
  });
  const [emailInput, setEmailInput] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [kidAge, setKidAge] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName.trim() || !formData.lastName.trim() || !kidAge || 
        !formData.kidGender || !formData.state || !formData.country || 
        (authMethod === 'email' && (!emailInput || !password || !confirmPassword))) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Email validation for email signup
    if (authMethod === 'email' && !validateEmail(emailInput)) {
      toast({
        title: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    // Password validation for email signup
    if (authMethod === 'email') {
      if (password !== confirmPassword) {
        toast({
          title: "Passwords do not match",
          variant: "destructive"
        });
        return;
      }
      
      if (!validatePassword(password)) {
        toast({
          title: "Password requirements not met",
          description: "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character (@$!%*?&)",
          variant: "destructive"
        });
        return;
      }
    }

    const ageNumber = parseInt(kidAge, 10);
    if (isNaN(ageNumber) || ageNumber < 0 || ageNumber > 18) {
      toast({
        title: "Please enter a valid age between 0 and 18",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onComplete({
        ...formData,
        email: authMethod === 'email' ? emailInput : email, // Use the email from state for email signup, or the prop for social
        password: authMethod === 'email' ? password : '', // Only set password for email signup
        kidAge: kidAge
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Complete Your Profile</h2>
        <p className="text-muted-foreground">
          We need a few more details to personalize your experience
        </p>
        {email && (
          <p className="text-sm text-muted-foreground">
            Signed in as: <span className="font-medium text-foreground">{email}</span>
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {authMethod === 'email' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters with uppercase, lowercase, number, and special character
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="John"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="kidAge">Age of your kid *</Label>
          <Input
            id="kidAge"
            type="number"
            min="0"
            max="18"
            value={kidAge}
            onChange={(e) => setKidAge(e.target.value)}
            placeholder="Enter age (0-18)"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label>Gender of your kid *</Label>
          <Select
            value={formData.kidGender}
            onValueChange={(value) => handleSelectChange('kidGender', value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="state">State *</Label>
            <Input
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="California"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country *</Label>
            <Input
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="United States"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isLoading}
          >
            Back
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
