import { useState } from "react";
import { APP_LOGO, APP_TITLE } from "@/const";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const CORRECT_PASSCODE = "1234";

export default function PasscodeLogin({ onLogin }: { onLogin: () => void }) {
  const [passcode, setPasscode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (passcode === CORRECT_PASSCODE) {
        localStorage.setItem("isAuthenticated", "true");
        toast.success("Login successful!");
        onLogin();
      } else {
        toast.error("Incorrect passcode. Please try again.");
        setPasscode("");
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-900">
      <div className="w-full max-w-md p-8">
        <div className="bg-black/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border-4 border-yellow-400">
          {/* Logo and Title */}
          <div className="flex flex-col items-center mb-8">
            <img
              src={APP_LOGO}
              alt={APP_TITLE}
              className="h-24 w-24 mb-4 object-contain"
            />
            <h1 className="text-3xl font-bold text-yellow-400 text-center">
              DivaLaser
            </h1>
            <p className="text-yellow-400/80 text-sm mt-1">Software Solutions</p>
            
            {/* Professional Photo */}
            <div className="mt-4 mb-4">
              <img
                src="/professional-photo.png"
                alt="Professional Photo"
                className="w-32 h-32 rounded-full object-cover border-4 border-yellow-400 shadow-lg"
              />
            </div>
            
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mt-2"></div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="passcode" className="text-yellow-400 text-lg mb-2 block">
                Enter Passcode
              </Label>
              <Input
                id="passcode"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••"
                maxLength={4}
                className="text-center text-2xl tracking-widest bg-blue-900/50 border-yellow-400/50 text-yellow-400 placeholder:text-yellow-400/30 focus:border-yellow-400 focus:ring-yellow-400"
                required
                autoFocus
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || passcode.length !== 4}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg py-6 rounded-lg transition-all transform hover:scale-105"
            >
              {isLoading ? "Verifying..." : "Login"}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-yellow-400/60 text-xs">
              Employee Management System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

