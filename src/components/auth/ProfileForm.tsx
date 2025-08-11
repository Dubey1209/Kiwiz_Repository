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
  kidAge: string;
  kidGender: string;
  state: string;
  country: string;
}

const ProfileForm = ({ email, authMethod, onComplete, onBack }: ProfileFormProps) => {
  const [formData, setFormData] = useState<Omit<ProfileData, 'kidAge'>>({
    firstName: '',
    lastName: '',
    kidGender: '',
    state: '',
    country: '',
  });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName.trim() || !formData.lastName.trim() || !kidAge || 
        !formData.kidGender || !formData.state || !formData.country) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
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
