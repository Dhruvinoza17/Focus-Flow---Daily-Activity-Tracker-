import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { MainLayout } from "./components/layout/MainLayout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { useAuthStore } from "./contexts/authStore";

const queryClient = new QueryClient();

function App() {
    const { initialize, loading, isAuthenticated } = useAuthStore();

    useEffect(() => {
        const unsubscribe = initialize();
        return () => unsubscribe();
    }, [initialize]);

    if (loading) {
        return (
            <div className="h-screen w-full bg-background flex items-center justify-center text-white">
                Loading...
            </div>
        );
    }

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
                    <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" />} />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<MainLayout />}>
                            <Route path="/" element={<DashboardPage />} />
                            <Route path="/today" element={<DashboardPage />} /> {/* Placeholder */}
                            <Route path="/tomorrow" element={<DashboardPage />} /> {/* Placeholder */}
                            <Route path="/upcoming" element={<DashboardPage />} /> {/* Placeholder */}
                            <Route path="/analytics" element={<DashboardPage />} /> {/* Placeholder */}
                            <Route path="/settings" element={<DashboardPage />} /> {/* Placeholder */}
                        </Route>
                    </Route>

                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
