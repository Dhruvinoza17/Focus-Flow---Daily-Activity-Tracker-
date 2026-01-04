import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { GlassCard } from "../components/ui/GlassCard";
import { Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";

const schema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export const LoginPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        setError(null);
        try {
            await signInWithEmailAndPassword(auth, data.email, data.password);
            navigate("/");
        } catch (err: any) {
            setError(err.message || "Failed to login");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4">
            <div className="absolute inset-0 max-w-lg mx-auto h-full bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <GlassCard className="w-full max-w-md space-y-8 z-10 relative overflow-hidden backdrop-blur-xl bg-card/40 border-white/10">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />

                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back</h1>
                        <p className="text-secondary">Enter your details to access your dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <Input
                                label="Email"
                                type="email"
                                icon={Mail}
                                placeholder="hello@example.com"
                                {...register('email')}
                                error={errors.email?.message}
                                autoComplete="email"
                            />
                            <Input
                                label="Password"
                                type="password"
                                icon={Lock}
                                placeholder="••••••••"
                                {...register('password')}
                                error={errors.password?.message}
                                autoComplete="current-password"
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-accent focus:ring-accent focus:ring-offset-0 cursor-pointer"
                                />
                                <label htmlFor="remember" className="text-secondary cursor-pointer select-none hover:text-white transition-colors">Remember for 30 days</label>
                            </div>
                            <a href="#" className="text-accent hover:text-accent/80 transition-colors">Forgot password?</a>
                        </div>

                        <Button type="submit" className="w-full h-12 text-base" isLoading={isLoading}>
                            Sign In
                        </Button>

                        <p className="text-center text-secondary text-sm">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-white hover:text-accent transition-colors font-medium">
                                Sign up
                            </Link>
                        </p>
                    </form>
                </GlassCard>
            </motion.div>
        </div>
    );
};
