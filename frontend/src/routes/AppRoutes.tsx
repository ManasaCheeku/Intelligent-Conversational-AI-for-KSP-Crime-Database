import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { DashboardPage } from "../pages/DashboardPage";
import { LoginPage } from "../pages/LoginPage";
import { NotFoundPage, UnauthorizedPage } from "../pages/SimplePages";
import { RegisterPage } from "../pages/RegisterPage";
import { CrimeDetailsPage } from "../pages/CrimeDetailsPage";
import { CrimeListPage } from "../pages/CrimeListPage";
import { CrimeSearchPage } from "../pages/CrimeSearchPage";
import { EditCrimePage } from "../pages/EditCrimePage";
import { ReportCrimePage } from "../pages/ReportCrimePage";
import { ProtectedRoute } from "./ProtectedRoute";
function PublicOnly({ children }: { children: React.ReactNode }) { const { isAuthenticated, isLoading } = useAuth(); if (isLoading) return <div className="screen-loader">Loading…</div>; return isAuthenticated ? <Navigate to="/dashboard" replace /> : children; }
export function AppRoutes() { return <Routes><Route path="/login" element={<PublicOnly><LoginPage /></PublicOnly>} /><Route path="/register" element={<PublicOnly><RegisterPage /></PublicOnly>} /><Route element={<ProtectedRoute />}><Route path="/dashboard" element={<DashboardPage />} /><Route path="/crimes" element={<CrimeListPage />} /><Route path="/crimes/search" element={<CrimeSearchPage />} /><Route path="/crimes/:id" element={<CrimeDetailsPage />} /><Route path="/crimes/:id/edit" element={<EditCrimePage />} /></Route><Route element={<ProtectedRoute allowedRoles={["citizen"]} />}><Route path="/crimes/report" element={<ReportCrimePage />} /></Route><Route path="/unauthorized" element={<UnauthorizedPage />} /><Route path="/" element={<Navigate to="/dashboard" replace />} /><Route path="*" element={<NotFoundPage />} /></Routes>; }
