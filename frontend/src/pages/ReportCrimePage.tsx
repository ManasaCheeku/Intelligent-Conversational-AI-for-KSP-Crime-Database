import { CrimeForm } from "../components/crime/CrimeForm";
import type { CrimeFormValues } from "../types/crime";

export function ReportCrimePage() {
    const handleSubmit = async (values: CrimeFormValues, files: File[]) => {
        console.log("Submitting", values, files);
        // crimeService.create would be called here
    };

    return (
        <CrimeForm onSubmit={handleSubmit} submitLabel="Submit Report" />
    );
}