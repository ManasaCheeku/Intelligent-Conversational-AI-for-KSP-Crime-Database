import { Link } from "react-router-dom";
import { MapPin, CalendarDays, Paperclip, User, Clock } from "lucide-react";
import { labelize, type Crime, CrimeStatus } from "../../types/crime";

const timeAgo = (date: string | Date): string => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}mo ago`;
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}y ago`;
};

const StatusBadge = ({ status }: { status: CrimeStatus }) => {
  const isInvestigating = status === 'under_investigation';
  return (
    <span className={`status-badge status--${status} ${isInvestigating ? 'status--investigating' : ''}`}>
      {labelize(status)}
    </span>
  );
};

export function CrimeCard({ crime }: { crime: Crime }) {
  const hasEvidence = (crime.evidence_items?.length ?? 0) > 0;

  return (
    <article className="crime-card">
        <header className="crime-card-header">
            <span className={`priority-tag priority--${crime.priority}`}>{labelize(crime.priority)}</span>
            <span className="case-number">{crime.crime_number}</span>
        </header>

        <div className="crime-card-body">
            <h3 className="crime-title">{crime.title}</h3>
            <p className="crime-type">{labelize(crime.crime_type)}</p>
            <p className="crime-description">{crime.description}</p>
        </div>

        <div className="crime-card-meta">
            <span><CalendarDays size={14} /> {new Date(crime.incident_date).toLocaleDateString()}</span>
            <span><MapPin size={14} /> {crime.district}, {crime.state}</span>
        </div>
        
        <footer className="crime-card-footer">
            <div className="footer-left">
                <StatusBadge status={crime.status} />
                {crime.assigned_officer_id && (
                    <span className="officer-chip">
                        <User size={14} />
                        Officer #{crime.assigned_officer_id}
                    </span>
                )}
            </div>
            <div className="footer-right">
                {hasEvidence && (
                  <span className="meta-chip" title={`${crime.evidence_items?.length} evidence items`}>
                    <Paperclip size={14} /> {crime.evidence_items?.length}
                  </span>
                )}
                <span className="meta-chip" title={`Last updated at ${new Date(crime.updated_at).toLocaleString()}`}>
                  <Clock size={14} /> {timeAgo(crime.updated_at)}
                </span>
                <Link to={`/crimes/${crime.id}`} className="details-link">View</Link>
            </div>
        </footer>
    </article>
  );
}
