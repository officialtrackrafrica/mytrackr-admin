import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { api } from "@/services/api";
import logo from "@/assets/logoicon.svg"
import loginimage from "@/assets/loginimage.png"

export const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    // The backend verifies the credentials and returns a Set-Cookie header.
    // The browser will automatically save that cookie.
    await api.post('/auth/admin/login', formData);
    
    toast.success("Welcome back to the control center!");
    navigate("/dashboard"); 
  } catch (error) {
    toast.error("Invalid credentials. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="max-h-screen flex justify-end w-full mx-0">
      {/* Left Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className=" rounded-full flex items-center justify-center mb-4">
              {/* <span className="text-brand-blue font-bold">MT</span> */}
              <img src={logo} alt="" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h1>
            <p className="text-sm text-slate-500">Welcome back! Please enter your details.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 mt-8">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                required 
                placeholder="Enter your email" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                placeholder="••••••••" 
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label htmlFor="remember" className="text-sm font-medium leading-none text-slate-600">
                  Remember for 30 days
                </label>
              </div>
              <a href="#" className="text-sm font-semibold text-blue-600 hover:underline">
                Forgot password
              </a>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
            
          
          </form>
          
          <div className="text-xs text-slate-400 mt-12 text-center lg:text-left">
            © MyTrackr 2026
          </div>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="max-h-fit">
        {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-200 opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center text-slate-400">
          [Financial Blueprint Graphic]
        </div> */}
        <img src={loginimage} alt="" className="h-full w-full"  />
      </div>
    </div>
  );
};