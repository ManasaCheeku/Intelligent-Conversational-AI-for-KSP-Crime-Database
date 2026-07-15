import { Link } from "react-router-dom";
export function UnauthorizedPage() { return <main className="simple-page"><h1>Access denied</h1><p>Your account role does not permit this page.</p><Link to="/dashboard">Return to dashboard</Link></main>; }
export function NotFoundPage() { return <main className="simple-page"><h1>Page not found</h1><Link to="/dashboard">Return to dashboard</Link></main>; }
