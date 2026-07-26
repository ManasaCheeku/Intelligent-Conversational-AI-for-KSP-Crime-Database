import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FiFileText, FiHash, FiMapPin, FiType, FiCalendar, FiClock, FiUploadCloud } from "react-icons/fi";
import type { Crime, CrimeFormValues } from "../../types/crime";
import { crimeTypes, labelize } from "../../types/crime";
import { CrimeLocationPicker } from "./CrimeLocationPicker";
import { EvidenceUpload } from "./EvidenceUpload";

interface Props { initialCrime?: Crime; onSubmit: (values: CrimeFormValues, files: File[]) => Promise<void>; submitLabel: string; allowEvidence?: boolean; }

const defaultValues: CrimeFormValues = {
  title: "",
  crime_type: "theft",
  description: "",
  location: "",
  district: "",
  state: "Karnataka",
  latitude: 12.9716,
  longitude: 77.5946,
  incident_date: "",
  incident_time: "",
};

export function CrimeForm({ initialCrime, onSubmit, submitLabel, allowEvidence = true }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<CrimeFormValues>({
    defaultValues: initialCrime ? { ...initialCrime, incident_time: initialCrime.incident_time.slice(0, 5) } : defaultValues
  });

  const latitude = watch("latitude");
  const longitude = watch("longitude");

  const submit = async (values: CrimeFormValues) => {
    try {
      await onSubmit(values, files);
    } catch {
      toast.error("Could not save the crime report. Please review the form and retry.");
    }
  };

  return (
    <form className="crime-form" onSubmit={handleSubmit(submit)}>
      <div className="form-section-divider">Incident Details</div>
      <div className="form-grid">
        <div className="form-field-floating">
          <input id="title" placeholder="e.g., Robbery at Koramangala" {...register("title", { required: "A clear crime title is required", minLength: { value: 5, message: "Use at least 5 characters" } })} />
          <label htmlFor="title">Crime Title</label>
          {errors.title && <small className="field-error">{errors.title.message}</small>}
        </div>
        <div className="form-field-floating">
          <select id="crime_type" {...register("crime_type", { required: true })}>
            {crimeTypes.map((type) => <option value={type} key={type}>{labelize(type)}</option>)}
          </select>
          <label htmlFor="crime_type">Crime Type</label>
        </div>
      </div>

      <div className="form-field-floating">
        <textarea id="description" rows={4} placeholder="Describe the incident with as much detail as possible..." {...register("description", { required: "Describe the incident", minLength: { value: 20, message: "Use at least 20 characters" } })} />
        <label htmlFor="description">Description</label>
        {errors.description && <small className="field-error">{errors.description.message}</small>}
      </div>

      <div className="form-grid">
        <div className="form-field-floating">
          <input id="incident_date" type="date" {...register("incident_date", { required: "Incident date is required" })} />
          <label htmlFor="incident_date">Incident Date</label>
          {errors.incident_date && <small className="field-error">{errors.incident_date.message}</small>}
        </div>
        <div className="form-field-floating">
          <input id="incident_time" type="time" {...register("incident_time", { required: "Incident time is required" })} />
          <label htmlFor="incident_time">Incident Time</label>
          {errors.incident_time && <small className="field-error">{errors.incident_time.message}</small>}
        </div>
      </div>

      <div className="form-section-divider">Location Details</div>

      <div className="form-field-floating">
        <input id="location" placeholder="Street, landmark, or full address" {...register("location", { required: "Location is required" })} />
        <label htmlFor="location">Incident Location</label>
      </div>

      <div className="form-grid">
        <div className="form-field-floating">
          <input id="district" placeholder="e.g., Bengaluru Urban" {...register("district", { required: "District is required" })} />
          <label htmlFor="district">District</label>
        </div>
        <div className="form-field-floating">
          <input id="state" {...register("state", { required: "State is required" })} />
          <label htmlFor="state">State</label>
        </div>
      </div>

      <CrimeLocationPicker
        value={{ lat: latitude || 12.9716, lng: longitude || 77.5946 }}
        onChange={(point) => {
          setValue("latitude", point.lat, { shouldValidate: true });
          setValue("longitude", point.lng, { shouldValidate: true });
        }}
      />

      {allowEvidence && (
        <>
          <div className="form-section-divider">Evidence</div>
          <EvidenceUpload files={files} onChange={setFiles} />
        </>
      )}

      <button className={`primary-button btn-lg btn-full ${isSubmitting ? 'is-loading' : ''}`} disabled={isSubmitting}>
        {isSubmitting ? "Saving Report..." : submitLabel}
      </button>
    </form>
  );
}
