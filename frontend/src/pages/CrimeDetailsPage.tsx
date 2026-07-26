import { useParams } from "react-router-dom";
import { AIInvestigationAssistant } from "../components/crime/AIInvestigationAssistant";

export function CrimeDetailsPage() {
    const { id } = useParams<{ id: string }>();

    if (!id) return <div>Invalid Crime ID</div>;

    return (
        <div>
            <h1>Crime Details for #{id}</h1>
            <AIInvestigationAssistant crimeId={parseInt(id, 10)} />
            {/* Other crime details components would go here */}
        </div>
    );
}