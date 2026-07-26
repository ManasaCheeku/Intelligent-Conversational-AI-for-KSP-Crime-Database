import { useEffect, useState, type ReactNode, type ElementType } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, SearchX } from "lucide-react";

import { CrimeCard } from "../components/crime/CrimeCard";
import { CrimeFilterSidebar } from "../components/crime/CrimeFilterSidebar";
import { crimeService } from "../services/crimeService";
import type { Crime, CrimeFilters } from "../types/crime";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/animations/Loader";

interface EmptyStateProps {
    icon: ElementType;
    title: string;
    children: ReactNode;
}

const EmptyState = ({ icon: Icon, title, children }: EmptyStateProps) => (
    <div className="empty-state-container">
        <div className="empty-state-icon"><Icon size={40} /></div>
        <h2 className="empty-state-title">{title}</h2>
        <p className="empty-state-message">{children}</p>
    </div>
);


export function CrimeListPage() {
    const { user } = useAuth();
    const [crimes, setCrimes] = useState<Crime[]>([]);
    const [filters, setFilters] = useState<CrimeFilters>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError("");
            try {
                await new Promise(resolve => setTimeout(resolve, 600));
                const results = await crimeService.list(filters);
                setCrimes(results);
            } catch {
                setError("Unable to load crime reports. Please check your connection.");
            } finally {
                setLoading(false);
            }
        };
        void load();
    }, [filters]);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="content-loader-container">
                    <Loader />
                    <p>Loading reports...</p>
                </div>
            );
        }

        if (error) {
            return <div className="form-error">{error}</div>;
        }

        if (crimes.length > 0) {
            return (
                <div className="card-grid">
                    {crimes.map((crime) => <CrimeCard crime={crime} key={crime.id} />)}
                </div>
            );
        }

        return (
            <EmptyState icon={SearchX} title="No Reports Found">
                Your search and filter combination did not return any results. Try adjusting your criteria.
            </EmptyState>
        );
    };

    return (
        <main className="page-shell">
            <div className="page-heading page-actions">
                <div>
                    <p className="eyebrow">Crime reporting</p>
                    <h1>{user?.role === "citizen" ? "My complaints" : "Crime reports"}</h1>
                    <p>Reports available under your assigned access level.</p>
                </div>
                {user?.role === "citizen" && (
                    <Link className="primary-button" to="/crimes/report">
                        <Plus size={17} /> Report crime
                    </Link>
                )}
            </div>

            <div className="crime-list-layout">
                <CrimeFilterSidebar filters={filters} onChange={setFilters} onClear={() => setFilters({})} />
                <section>
                    <div className="search-bar">
                        <Search size={20} />
                        <input
                            value={filters.query || ""}
                            onChange={(event) => setFilters({ ...filters, query: event.target.value })}
                            placeholder="Search by keyword, case number, or location..."
                        />
                    </div>
                    {renderContent()}
                </section>
            </div>
        </main>
    );
}