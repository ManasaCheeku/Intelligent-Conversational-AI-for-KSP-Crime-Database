export function NotFoundPage() {
    return (
        <div className="simple-page">
            <h1>404 - Not Found</h1>
        </div>
    );
}

export function UnauthorizedPage() {
    return (
        <div className="simple-page">
            <h1>403 - Unauthorized</h1>
        </div>
    );
}

export function ComingSoonPage() {
    return (
        <div className="simple-page" style={{textAlign: 'center', paddingTop: '50px'}}>
            <h1>Coming Soon</h1>
            <p>This feature is under development.</p>
        </div>
    );
}