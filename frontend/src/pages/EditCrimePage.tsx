import { useParams } from "react-router-dom";

export function EditCrimePage() {
    const { id } = useParams<{ id: string }>();

    return (
        <div>
            <h1>Edit Crime #{id}</h1>
            {/* CrimeForm would be used here in edit mode */}
        </div>
    );
}