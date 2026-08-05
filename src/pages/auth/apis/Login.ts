// import { api } from "@/services/api";
// import { toast } from "sonner";

// const handleLogin = async (e: React.FormEvent) => {
//   e.preventDefault();
//   setIsLoading(true);

//   try {
//     // The backend verifies the credentials and returns a Set-Cookie header.
//     // The browser will automatically save that cookie.
//     await api.post('/admin/login', formData);
    
//     toast.success("Welcome back to the control center!");
//     navigate("/dashboard"); 
//   } catch (error) {
//     toast.error("Invalid credentials. Please try again.");
//   } finally {
//     setIsLoading(false);
//   }
// };