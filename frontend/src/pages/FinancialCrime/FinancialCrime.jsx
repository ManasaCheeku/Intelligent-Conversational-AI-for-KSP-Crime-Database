import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  FiAlertTriangle,
  FiShare2,
  FiGitBranch,
  FiCreditCard,
  FiClock,
  FiRefreshCw,
  FiArrowRight,
  FiShield,
  FiPieChart,
  FiFilter,
} from 'react-icons/fi';
import { getTransactions } from '../../services/crimeService';
import { formatCurrencyINR, formatDate, formatDateTime } from '../../utils/formatters';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.35, ease: 'easeOut' } }),
};

const FLAG_COLOR = {
  Suspicious: '#F0616D',
  'Under Review': '#F6B451',
  Cleared: '#2BD9C9',
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

function flagBadgeClasses(flag) {
  switch (flag) {
    case 'Suspicious':
      return 'bg-signal-red/15 text-signal-red border-signal-red/40';
    case 'Under Review':
      return 'bg-signal-amber/15 text-signal-amber border-signal-amber/40';
    default:
      return 'bg-signal-teal/15 text-signal-teal border-signal-teal/40';
  }
}

function buildNetwork(transactions) {
  const accountSet = new Set();
  transactions.forEach((t) => {
    accountSet.add(t.from);
    accountSet.add(t.to);
  });
  const accounts = Array.from(accountSet);
  const radius = 220;
  const cx = 320;
  const cy = 210;

  const nodes = accounts.map((acc, i) => {
    const angle = (i / accounts.length) * Math.PI * 2;
    const flagged = transactions.some((t) => (t.from === acc || t.to === acc) && t.flag === 'Suspicious');
    return {
      id: acc,
      position: { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) },
      data: { label: acc },
      style: {
        background: flagged ? 'rgba(240,97,109,0.12)' : 'rgba(19,28,48,0.9)',
        border: `1px solid ${flagged ? '#F0616D' : '#26324A'}`,
        color: flagged ? '#F0616D' : '#E7ECF4',
        borderRadius: 8,
        fontSize: 11,
        fontFamily: 'IBM Plex Mono, monospace',
        padding: '6px 10px',
        width: 'auto',
      },
    };
  });

  const edges = transactions.slice(0, 22).map((t) => ({
    id: t.id,
    source: t.from,
    target: t.to,
    label: formatCurrencyINR(t.amount),
    animated: t.flag === 'Suspicious',
    style: { stroke: FLAG_COLOR[t.flag], opacity: 0.8 },
    labelStyle: { fill: '#8695AD', fontSize: 10, fontFamily: 'IBM Plex Mono, monospace' },
    labelBgStyle: { fill: '#0B1120', opacity: 0.8 },
  }));

  return { nodes, edges };
}

export default function FinancialCrime() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    let mounted = true;
    getTransactions().then((data) => {
      if (!mounted) return;
      setTransactions(data);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const network = useMemo(() => buildNetwork(transactions), [transactions]);

  const suspicious = useMemo(() => transactions.filter((t) => t.flag === 'Suspicious'), [transactions]);

  const moneyTrail = useMemo(
    () => [...suspicious].sort((a, b) => a.date - b.date).slice(0, 5),
    [suspicious]
  );

  const suspiciousAccounts = useMemo(() => {
    const map = new Map();
    transactions.forEach((t) => {
      [t.from, t.to].forEach((acc) => {
        if (!map.has(acc)) map.set(acc, { account: acc, suspiciousCount: 0, suspiciousAmount: 0, totalCount: 0 });
        const entry = map.get(acc);
        entry.totalCount += 1;
        if (t.flag === 'Suspicious') {
          entry.suspiciousCount += 1;
          entry.suspiciousAmount += t.amount;
        }
      });
    });
    return Array.from(map.values())
      .filter((a) => a.suspiciousCount > 0)
      .map((a) => ({ ...a, riskScore: Math.min(100, a.suspiciousCount * 22 + a.suspiciousAmount / 90000) }))
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 6);
  }, [transactions]);

  const channelStats = useMemo(() => {
    const map = new Map();
    transactions.forEach((t) => {
      if (!map.has(t.channel)) map.set(t.channel, { channel: t.channel, total: 0, count: 0, flagged: 0 });
      const e = map.get(t.channel);
      e.total += t.amount;
      e.count += 1;
      if (t.flag === 'Suspicious') e.flagged += 1;
    });
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [transactions]);

  const alerts = useMemo(() => {
    if (!suspiciousAccounts.length) return [];
    return suspiciousAccounts.slice(0, 3).map((a, i) => ({
      id: i,
      title: `Cluster flagged around ${a.account}`,
      body: `${a.suspiciousCount} suspicious transaction${a.suspiciousCount > 1 ? 's' : ''} totaling ${formatCurrencyINR(
        a.suspiciousAmount
      )} routed through this account in the last cycle. Recommend priority trace.`,
      severity: a.riskScore >= 70 ? 'critical' : a.riskScore >= 45 ? 'high' : 'medium',
    }));
  }, [suspiciousAccounts]);

  function runAiSweep() {
    setScanning(true);
    setTimeout(() => setScanning(false), 1100);
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-base-700 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-signal-teal">Financial Intelligence</p>
          <h1 className="font-display text-xl font-semibold text-ink-100 sm:text-2xl">Financial Crime Analysis</h1>
          <p className="mt-1 text-sm text-ink-500">
            Tracking {transactions.length} transactions · {suspicious.length} flagged as suspicious
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-base-600 bg-base-700 px-3.5 py-2 text-sm font-medium text-ink-300 transition hover:border-signal-teal/50 hover:text-signal-teal">
            <FiFilter size={14} /> Last 30 days
          </button>
          <button
            onClick={runAiSweep}
            disabled={scanning}
            className="flex items-center gap-2 rounded-lg bg-signal-teal px-3.5 py-2 text-sm font-medium text-base-900 transition hover:bg-signal-tealDim disabled:opacity-60"
          >
            <FiRefreshCw className={scanning ? 'animate-spin' : ''} size={15} />
            {scanning ? 'Scanning...' : 'Run AI Sweep'}
          </button>
        </div>
      </div>

      {/* AI Alerts */}
      <Panel title="AI Alerts" icon={FiAlertTriangle}>
        {loading ? (
          <p className="text-sm text-ink-500">Analyzing transaction data...</p>
        ) : alerts.length === 0 ? (
          <p className="text-sm text-ink-500">No active alerts. All monitored accounts are within normal patterns.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`rounded-lg border p-3.5 ${
                  alert.severity === 'critical'
                    ? 'border-signal-red/40 bg-signal-red/10'
                    : alert.severity === 'high'
                    ? 'border-signal-red/25 bg-signal-red/5'
                    : 'border-signal-amber/30 bg-signal-amber/10'
                }`}
              >
                <p className="mb-1 font-mono text-[11px] uppercase tracking-wide text-signal-red">{alert.severity}</p>
                <p className="text-sm font-medium text-ink-100">{alert.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-500">{alert.body}</p>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Transaction Network */}
        <Panel title="Transaction Network" icon={FiShare2} className="lg:col-span-2">
          <div className="h-[420px] w-full overflow-hidden rounded-lg border border-base-700 bg-base-900/60">
            {transactions.length > 0 && (
              <ReactFlow
                nodes={network.nodes}
                edges={network.edges}
                fitView
                proOptions={{ hideAttribution: true }}
                nodesDraggable
              >
                <Background color="#1A2438" gap={20} />
                <Controls showInteractive={false} />
                <MiniMap
                  pannable
                  zoomable
                  maskColor="rgba(7,11,20,0.7)"
                  style={{ background: '#0B1120', border: '1px solid #26324A' }}
                  nodeColor={() => '#26324A'}
                />
              </ReactFlow>
            )}
          </div>
          <p className="mt-2 text-xs text-ink-500">
            Nodes represent accounts; red outlines indicate accounts linked to at least one suspicious transaction. Animated edges are actively flagged transfers.
          </p>
        </Panel>

        {/* Sankey Diagram Placeholder */}
        <Panel title="Fund Flow (Sankey)" icon={FiPieChart}>
          <div className="flex h-[420px] flex-col items-center justify-center rounded-lg border border-dashed border-base-600 bg-base-900/40 p-6 text-center">
            <FiPieChart size={30} className="mb-3 text-ink-700" />
            <p className="text-sm font-medium text-ink-300">Sankey diagram placeholder</p>
            <p className="mt-1 max-w-[220px] text-xs text-ink-500">
              Full multi-stage fund-flow visualization (source accounts → intermediaries → destination) will render here once the
              flow-aggregation service is connected.
            </p>
            <span className="mt-4 rounded-full border border-base-600 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-ink-700">
              Coming soon
            </span>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Money Trail */}
        <Panel title="Money Trail" icon={FiGitBranch}>
          {moneyTrail.length === 0 ? (
            <p className="text-sm text-ink-500">No suspicious trail detected in the current window.</p>
          ) : (
            <ol className="space-y-4">
              {moneyTrail.map((t, i) => (
                <motion.li key={t.id} variants={fadeUp} initial="hidden" animate="show" custom={i} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-signal-red/40 bg-signal-red/10 font-mono text-[11px] text-signal-red">
                    {i + 1}
                  </span>
                  <div className="flex flex-1 flex-wrap items-center gap-2 rounded-lg border border-base-700 bg-base-900/50 px-3 py-2">
                    <span className="font-mono text-xs text-ink-100">{t.from}</span>
                    <FiArrowRight className="text-ink-500" size={13} />
                    <span className="font-mono text-xs text-ink-100">{t.to}</span>
                    <span className="ml-auto font-mono text-xs text-signal-red">{formatCurrencyINR(t.amount)}</span>
                    <span className="font-mono text-[10px] uppercase text-ink-500">{t.channel}</span>
                  </div>
                </motion.li>
              ))}
            </ol>
          )}
        </Panel>

        {/* Bank Analysis */}
        <Panel title="Bank Analysis" icon={FiCreditCard}>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelStats} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid stroke="#1A2438" horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => `₹${Math.round(v / 100000)}L`} tick={{ fill: '#8695AD', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="channel" tick={{ fill: '#B9C4D6', fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
                <Tooltip
                  formatter={(v) => formatCurrencyINR(v)}
                  contentStyle={{ background: '#131C30', border: '1px solid #26324A', borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                  {channelStats.map((c) => (
                    <Cell key={c.channel} fill={c.flagged > 0 ? '#F0616D' : '#2BD9C9'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {channelStats.map((c) => (
              <div key={c.channel} className="rounded-lg border border-base-700 bg-base-900/40 p-2.5">
                <p className="font-mono text-[11px] text-ink-500">{c.channel}</p>
                <p className="text-sm font-semibold text-ink-100">{c.count} txns</p>
                {c.flagged > 0 && <p className="text-[11px] text-signal-red">{c.flagged} flagged</p>}
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Suspicious Accounts */}
      <Panel title="Suspicious Accounts" icon={FiShield}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-base-700 text-xs uppercase tracking-wide text-ink-500">
                <th className="pb-2 pr-4">Account</th>
                <th className="pb-2 pr-4">Suspicious Txns</th>
                <th className="pb-2 pr-4">Flagged Amount</th>
                <th className="pb-2">Risk Score</th>
              </tr>
            </thead>
            <tbody>
              {suspiciousAccounts.map((a) => (
                <tr key={a.account} className="border-b border-base-700/60 last:border-0">
                  <td className="py-2.5 pr-4 font-mono text-ink-100">{a.account}</td>
                  <td className="py-2.5 pr-4 text-ink-300">{a.suspiciousCount}</td>
                  <td className="py-2.5 pr-4 text-ink-300">{formatCurrencyINR(a.suspiciousAmount)}</td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-base-700">
                        <div
                          className={`h-full rounded-full ${a.riskScore >= 70 ? 'bg-signal-red' : a.riskScore >= 45 ? 'bg-signal-amber' : 'bg-signal-teal'}`}
                          style={{ width: `${Math.min(100, a.riskScore)}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs text-ink-300">{Math.round(a.riskScore)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Fraud Timeline */}
      <Panel title="Fraud Timeline" icon={FiClock}>
        {suspicious.length === 0 ? (
          <p className="text-sm text-ink-500">No suspicious transactions recorded.</p>
        ) : (
          <ol className="relative space-y-5 border-l border-base-600 pl-5">
            {[...suspicious]
              .sort((a, b) => b.date - a.date)
              .map((t, i) => (
                <motion.li key={t.id} variants={fadeUp} initial="hidden" animate="show" custom={i} className="relative">
                  <span className="absolute -left-[27px] flex h-4 w-4 items-center justify-center rounded-full border border-signal-red bg-base-900">
                    <FiAlertTriangle size={9} className="text-signal-red" />
                  </span>
                  <p className="font-mono text-[11px] text-ink-500">{formatDateTime(t.date)}</p>
                  <p className="text-sm text-ink-100">
                    <span className="font-mono">{t.from}</span> <FiArrowRight className="inline text-ink-500" size={11} />{' '}
                    <span className="font-mono">{t.to}</span> — {formatCurrencyINR(t.amount)} via {t.channel}
                  </p>
                  <span className={`mt-1 inline-block rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase ${flagBadgeClasses(t.flag)}`}>
                    {t.flag}
                  </span>
                </motion.li>
              ))}
          </ol>
        )}
      </Panel>
    </div>
  );
}