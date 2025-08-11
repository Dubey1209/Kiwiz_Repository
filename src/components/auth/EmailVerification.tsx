import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface EmailVerificationProps {
  email: string;
  onVerify: (otp: string) => void;
  onResend: () => Promise<boolean>;
  onBack: () => void;
}

const EmailVerification = ({ email, onVerify, onResend, onBack }: EmailVerificationProps) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const { toast } = useToast();

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    
    // Only allow numbers and limit to 1 character
    if (value && !/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take the last character
    setOtp(newOtp);
    
    // Auto-focus to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
    
    // If all fields are filled, submit
    if (newOtp.every(digit => digit) && index === 5) {
      handleVerify();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };
  
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').trim();
    if (/^\d{6}$/.test(pasteData)) {
      const newOtp = pasteData.split('').slice(0, 6);
      setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')]);
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit verification code.",
        variant: "destructive"
      });
      return;
    }
    
    setIsVerifying(true);
    onVerify(otpString);
  };

  const handleResend = async () => {
    if (resendCountdown > 0) return;
    
    setIsResending(true);
    const success = await onResend();
    setIsResending(false);
    
    if (success) {
      // Start 30-second countdown before allowing resend
      setResendCountdown(30);
      const timer = setInterval(() => {
        setResendCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Verify Your Email</h2>
        <p className="text-muted-foreground">
          We've sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center space-x-2">
          {otp.map((digit, index) => (
            <Input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="h-14 w-12 text-center text-xl font-semibold"
              autoFocus={index === 0}
              disabled={isVerifying}
            />
          ))}
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Didn't receive a code?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCountdown > 0 || isResending}
            className="text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResending ? (
              'Sending...'
            ) : resendCountdown > 0 ? (
              `Resend in ${resendCountdown}s`
            ) : (
              'Resend code'
            )}
          </button>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isVerifying}
        >
          Back
        </Button>
        <Button 
          type="button" 
          onClick={handleVerify}
          disabled={otp.some(digit => !digit) || isVerifying}
        >
          {isVerifying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify Email'
          )}
        </Button>
      </div>
    </div>
  );
};

export default EmailVerification;
