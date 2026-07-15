import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiFileText,
  FiVideo,
  FiUsers,
  FiMapPin,
  FiPrinter,
  FiRefreshCw,
  FiCheckCircle,
  FiCircle,
  FiAlertTriangle,
  FiTrendingUp,
  FiClock,
  FiUser,
  FiPlus,
  FiLink2,
  FiShield,
} from 'react-icons/fi';
import { getCases, getEvidenceTimeline } from '../../services/crimeService';
import { formatCaseId, formatDateTime } from '../../utils/formatters';
import { CASE_STATUS } from '../../utils/constants';

const EVIDENCE_ICON = {
  document: FiFileText,
  media: FiVideo,
  testimony: FiUsers,
  lead: FiMapPin,
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.35, ease: 'easeOut' } }),
};

function Panel({ title, icon: Icon, actions, children, className = '' }) {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className={`rounded-xl border border-base-700 bg-base-800/60 shadow-panel ${className}`}
    >
      <div className="flex items-center justify-between border-b border-base-700 px-5 py-3.5">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="text-signal-teal" size={16} />}
          <h2 className="font-display text-sm font-semibold tracking-wide text-ink-100">{title}</h2>
        </div>
        {actions}
      </div>
      <div className="p-5">{children}</div>
    </motion.section>
  );
}

function riskBadgeClasses(level) {
  switch (level) {
    case 'critical':
      return 'bg-signal-red/15 text-signal-red border-signal-red/40';
    case 'high':
      return 'bg-signal-red/10 text-signal-red border-signal-red/30';
    case 'medium':
      return 'bg-signal-amber/15 text-signal-amber border-signal-amber/40';
    default:
      return 'bg-signal-teal/15 text-signal-teal border-signal-teal/40';
  }
}

function buildSummary(caseItem) {
  if (!caseItem) return null;
  return {
    risk: caseItem.priority === 'Critical' ? 'critical' : caseItem.priority === 'High' ? 'high' : caseItem.priority === 'Medium' ? 'medium' : 'low',
    text: `${caseItem.title} is currently marked "${caseItem.status}" with ${caseItem.evidenceCount} pieces of evidence logged. Pattern analysis links this case to a recurring modus operandi seen in the same jurisdiction over the last 90 days. Movement data and prior-offense records suggest the primary subject has direct ties to at least one associate flagged in an open financial-crime investigation. Immediate priority: corroborate the CCTV timeline against call data records before the next hearing window.`,
    entities: ['Primary suspect', 'Associate — financial link', 'Vehicle: KA-05 area', 'Toll plaza sighting'],
  };
}

function similarityScore(seed) {
  const v = Math.abs(Math.sin(seed * 999)) * 100;
  return Math.round(55 + (v % 40));
}

export default function InvestigatorSupport() {
  const { caseId } = useParams();

  const [cases, setCases] = useState([]);
  const [activeCase, setActiveCase] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summary, setSummary] = useState(null);
  const [leads, setLeads] = useState([]);
  const [notes, setNotes] = useState([
    { id: 1, author: 'Insp. Verma', time: '2026-07-10 18:40', text: 'Requested CDR from telecom provider, awaiting response.' },
    { id: 2, author: 'SI Nanda', time: '2026-07-12 09:15', text: 'Witness corroborates suspect vehicle at the junction around 21:00.' },
  ]);
  const [draftNote, setDraftNote] = useState('');

  useEffect(() => {
    let mounted = true;
    getCases().then((data) => {
      if (!mounted) return;
      setCases(data);
      const found = caseId ? data.find((c) => String(c.id) === String(caseId)) : null;
      setActiveCase(found || data[0]);
    });
    return () => {
      mounted = false;
    };
  }, [caseId]);

  useEffect(() => {
    if (!activeCase) return;
    getEvidenceTimeline(activeCase.id).then(setTimeline);
    setSummary(buildSummary(activeCase));
    setLeads([
      { id: 1, priority: 'High', text: 'Cross-reference toll plaza sighting with vehicle registry.', done: false },
      { id: 2, priority: 'Medium', text: 'Interview secondary witness near the CCTV blind spot.', done: false },
      { id: 3, priority: 'High', text: 'Trace financial transfers linked to the flagged associate.', done: true },
      { id: 4, priority: 'Low', text: 'Confirm forensic lab turnaround for trace evidence.', done: false },
    ]);
  }, [activeCase]);

  const similarCases = useMemo(() => {
    if (!activeCase) return [];
    return cases
      .filter((c) => c.id !== activeCase.id)
      .map((c) => ({ ...c, similarity: similarityScore(c.id) }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 4);
  }, [cases, activeCase]);

  const statusIndex = activeCase ? CASE_STATUS.indexOf(activeCase.status) : -1;

  function regenerateSummary() {
    setLoadingSummary(true);
    setTimeout(() => {
      setSummary(buildSummary(activeCase));
      setLoadingSummary(false);
    }, 900);
  }

  function toggleLead(id) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, done: !l.done } : l)));
  }

  function addNote() {
    if (!draftNote.trim()) return;
    setNotes((prev) => [
      { id: Date.now(), author: 'You', time: formatDateTime(new Date()), text: draftNote.trim() },
      ...prev,
    ]);
    setDraftNote('');
  }

  function exportBriefing() {
    window.print();
  }

  if (!activeCase) {
    return (
      <div className="flex h-64 items-center justify-center text-ink-500">
        <FiRefreshCw className="mr-2 animate-spin" /> Loading case file...
      </div>
    );
  }

  return (
    <div id="investigator-support-print" className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-base-700 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-signal-teal">{formatCaseId(activeCase.id)}</p>
          <h1 className="font-display text-xl font-semibold text-ink-100 sm:text-2xl">{activeCase.title}</h1>
          <p className="mt-1 text-sm text-ink-500">
            Assigned to <span className="text-ink-300">{activeCase.assignedTo}</span> · Updated {formatDateTime(activeCase.updated)}
          </p>
        </div>
        <div className="flex items-center gap-2 print:hidden">
          <span className={`rounded-full border px-3 py-1 font-mono text-xs uppercase ${riskBadgeClasses(summary?.risk)}`}>
            {activeCase.priority} priority
          </span>
          <button
            onClick={exportBriefing}
            className="flex items-center gap-2 rounded-lg border border-base-600 bg-base-700 px-3.5 py-2 text-sm font-medium text-ink-100 transition hover:border-signal-teal/50 hover:text-signal-teal"
          >
            <FiPrinter size={15} /> Export Briefing (PDF)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* AI Case Summary */}
          <Panel
            title="AI Case Summary"
            icon={FiShield}
            actions={
              <button
                onClick={regenerateSummary}
                disabled={loadingSummary}
                className="flex items-center gap-1.5 rounded-md border border-base-600 px-2.5 py-1 text-xs text-ink-300 transition hover:text-signal-teal disabled:opacity-50 print:hidden"
              >
                <FiRefreshCw className={loadingSummary ? 'animate-spin' : ''} size={13} />
                Regenerate
              </button>
            }
          >
            {loadingSummary ? (
              <div className="space-y-2">
                <div className="h-3 w-full animate-pulse rounded bg-base-700" />
                <div className="h-3 w-11/12 animate-pulse rounded bg-base-700" />
                <div className="h-3 w-9/12 animate-pulse rounded bg-base-700" />
              </div>
            ) : (
              <>
                <p className="text-sm leading-relaxed text-ink-300">{summary?.text}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {summary?.entities.map((e) => (
                    <span key={e} className="rounded-full border border-base-600 bg-base-900/60 px-2.5 py-1 font-mono text-[11px] text-ink-300">
                      {e}
                    </span>
                  ))}
                </div>
              </>
            )}
          </Panel>

          {/* Investigation Timeline */}
          <Panel title="Investigation Timeline" icon={FiClock}>
            <ol className="relative space-y-5 border-l border-base-600 pl-5">
              {timeline.map((item, i) => {
                const Icon = EVIDENCE_ICON[item.type] || FiFileText;
                return (
                  <motion.li key={item.id} variants={fadeUp} initial="hidden" animate="show" custom={i} className="relative">
                    <span className="absolute -left-[27px] flex h-4 w-4 items-center justify-center rounded-full border border-signal-teal bg-base-900">
                      <Icon size={9} className="text-signal-teal" />
                    </span>
                    <p className="font-mono text-[11px] text-ink-500">{item.time}</p>
                    <p className="text-sm text-ink-100">{item.label}</p>
                  </motion.li>
                );
              })}
            </ol>
          </Panel>

          {/* Evidence List */}
          <Panel title="Evidence List" icon={FiFileText}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-base-700 text-xs uppercase tracking-wide text-ink-500">
                    <th className="pb-2 pr-4">Item</th>
                    <th className="pb-2 pr-4">Type</th>
                    <th className="pb-2">Logged</th>
                  </tr>
                </thead>
                <tbody>
                  {timeline.map((item) => (
                    <tr key={item.id} className="border-b border-base-700/60 last:border-0">
                      <td className="py-2.5 pr-4 text-ink-100">{item.label}</td>
                      <td className="py-2.5 pr-4">
                        <span className="rounded-full border border-base-600 bg-base-900/50 px-2 py-0.5 font-mono text-[11px] capitalize text-ink-300">
                          {item.type}
                        </span>
                      </td>
                      <td className="py-2.5 font-mono text-xs text-ink-500">{item.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          {/* Similar Cases */}
          <Panel title="Similar Cases" icon={FiLink2}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {similarCases.map((c) => (
                <div key={c.id} className="rounded-lg border border-base-700 bg-base-900/50 p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-mono text-[11px] text-signal-teal">{formatCaseId(c.id)}</p>
                      <p className="text-sm text-ink-100">{c.title}</p>
                    </div>
                    <span className="whitespace-nowrap rounded-full border border-signal-violet/40 bg-signal-violet/10 px-2 py-0.5 font-mono text-[11px] text-signal-violet">
                      {c.similarity}% match
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-ink-500">{c.status} · {c.assignedTo}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          {/* Investigation Status */}
          <Panel title="Investigation Status" icon={FiTrendingUp}>
            <ol className="space-y-3">
              {CASE_STATUS.map((status, i) => {
                const reached = i <= statusIndex;
                const current = i === statusIndex;
                return (
                  <li key={status} className="flex items-center gap-3">
                    {reached ? (
                      <FiCheckCircle className={current ? 'text-signal-teal' : 'text-ink-500'} size={16} />
                    ) : (
                      <FiCircle className="text-base-600" size={16} />
                    )}
                    <span className={`text-sm ${current ? 'font-semibold text-signal-teal' : reached ? 'text-ink-300' : 'text-ink-700'}`}>
                      {status}
                    </span>
                  </li>
                );
              })}
            </ol>
          </Panel>

          {/* Recommended Leads */}
          <Panel title="Recommended Leads" icon={FiAlertTriangle}>
            <ul className="space-y-2.5">
              {leads.map((lead) => (
                <li key={lead.id} className="flex items-start gap-2.5 rounded-lg border border-base-700 bg-base-900/40 p-3">
                  <button onClick={() => toggleLead(lead.id)} className="mt-0.5 shrink-0 print:hidden">
                    {lead.done ? (
                      <FiCheckCircle className="text-signal-teal" size={16} />
                    ) : (
                      <FiCircle className="text-ink-500" size={16} />
                    )}
                  </button>
                  <div>
                    <span
                      className={`mb-1 inline-block rounded-full px-2 py-0.5 font-mono text-[10px] uppercase ${
                        lead.priority === 'High'
                          ? 'bg-signal-red/15 text-signal-red'
                          : lead.priority === 'Medium'
                          ? 'bg-signal-amber/15 text-signal-amber'
                          : 'bg-signal-teal/15 text-signal-teal'
                      }`}
                    >
                      {lead.priority}
                    </span>
                    <p className={`text-sm ${lead.done ? 'text-ink-700 line-through' : 'text-ink-100'}`}>{lead.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          {/* Officer Notes */}
          <Panel title="Officer Notes" icon={FiUser}>
            <div className="mb-3 flex gap-2 print:hidden">
              <input
                value={draftNote}
                onChange={(e) => setDraftNote(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addNote()}
                placeholder="Add a field note..."
                className="w-full rounded-md border border-base-600 bg-base-900/60 px-3 py-2 text-sm text-ink-100 placeholder:text-ink-700 focus:border-signal-teal"
              />
              <button
                onClick={addNote}
                className="flex shrink-0 items-center gap-1 rounded-md bg-signal-teal px-3 py-2 text-sm font-medium text-base-900 transition hover:bg-signal-tealDim"
              >
                <FiPlus size={14} /> Add
              </button>
            </div>
            <ul className="max-h-64 space-y-3 overflow-y-auto pr-1">
              {notes.map((note) => (
                <li key={note.id} className="border-b border-base-700/60 pb-2.5 last:border-0">
                  <p className="text-sm text-ink-100">{note.text}</p>
                  <p className="mt-1 font-mono text-[11px] text-ink-500">
                    {note.author} · {note.time}
                  </p>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}