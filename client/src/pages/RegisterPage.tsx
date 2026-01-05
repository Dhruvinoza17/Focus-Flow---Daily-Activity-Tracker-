import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { GlassCard } from "../components/ui/GlassCard";
import { User, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";

const schema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters").regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers and underscores"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export const RegisterPage = () => {
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
            // 1. Check Username Availability
            const usernameQuery = query(collection(db, "users"), where("username", "==", data.username));
            const usernameSnapshot = await getDocs(usernameQuery);

            if (!usernameSnapshot.empty) {
                throw new Error("Username is already taken");
            }

            // 2. Create Auth User
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            const user = userCredential.user;

            // 3. Update Display Name (using username as display name)
            await updateProfile(user, {
                displayName: data.username
            });

            // 4. Create User Document in Firestore
            await setDoc(doc(db, "users", user.uid), {
                username: data.username,
                email: data.email,
                accentColor: '#14B8A6',
                createdAt: new Date().toISOString()
            });

            navigate("/");
        } catch (err: any) {
            setError(err.message || "Failed to create account");
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
                        <h1 className="text-3xl font-bold text-primary tracking-tight">Create account</h1>
                        <p className="text-secondary">Start tracking your learning journey today</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <Input
                                label="Username"
                                type="text"
                                icon={User}
                                placeholder="johndoe"
                                {...register('username')}
                                error={errors.username?.message}
                            />
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
                                autoComplete="new-password"
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full h-12 text-base" isLoading={isLoading}>
                            Get Started
                        </Button>

                        <p className="text-center text-secondary text-sm">
                            Already have an account?{" "}
                            <Link to="/login" className="text-primary hover:text-accent transition-colors font-medium">
                                Sign in
                            </Link>
                        </p>
                    </form>
                </GlassCard>
            </motion.div>
        </div>
    );
};
