import React from 'react';
import { motion } from 'framer-motion';
import { Map, BarChart2, List, AlertTriangle, User, Search } from 'lucide-react';

const DashboardWidget = ({ icon: Icon, title, children, className = '' }) => (
    <div className={`glass-card rounded-2xl p-6 h-full flex flex-col ${className}`}>
        <div className="flex items-center gap-3 mb-4">
            <Icon className="text-cyan-400" size={20} />
            <h4 className="font-bold text-white">{title}</h4>
        </div>
        <div className="flex-grow">{children}</div>
    </div>
);

export const DashboardPreview = () => {
    return (
        <section className="py-24 bg-slate-950">
            <div className="max-w-7xl mx-auto px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white">Live Intelligence Dashboard</h2>
                    <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
                        A glimpse into the real-time command center used by officers to monitor and respond to criminal activity.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]"
                >
                    {/* Column 1 */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        <DashboardWidget icon={Map} title="Karnataka Crime Heatmap">
                           <div className="w-full h-full bg-cover bg-center rounded-lg" style={{backgroundImage: "url('https://placehold.co/800x400/050a19/1e293b.png?text=Karnataka+Map+with+Heatmap+Data')"}}></div>
                        </DashboardWidget>
                    </div>

                    {/* Column 2 */}
                    <div className="flex flex-col gap-8">
                        <DashboardWidget icon={AlertTriangle} title="Live AI Alerts">
                            <div className="space-y-3 text-sm">
                                <p className="text-red-400">High-priority: Suspicious Vehicle near Vidhana Soudha.</p>
                                <p className="text-orange-400">Medium-priority: Unusual crowd formation in Cubbon Park.</p>
                                <p className="text-yellow-400">Low-priority: Pattern deviation in Malleswaram district.</p>
                            </div>
                        </DashboardWidget>
                        <DashboardWidget icon={List} title="Recent FIRs">
                            <div className="space-y-2 text-sm text-slate-300">
                               <p>#7584: Robbery at Kormangala</p>
                               <p>#7583: Vandalism at Indiranagar</p>
                               <p>#7582: Cybercrime report from Whitefield</p>
                            </div>
                        </DashboardWidget>
                    </div>

                    {/* Row 2 */}
                    <div className="lg:col-span-3 grid md:grid-cols-3 gap-8">
                         <DashboardWidget icon={BarChart2} title="Crime Trends">
                            <div className="w-full h-full bg-contain bg-no-repeat bg-center" style={{backgroundImage: "url('https://placehold.co/400x200/050a19/1e293b.png?text=Crime+Trend+Chart')"}}></div>
                        </DashboardWidget>
                        <DashboardWidget icon={User} title="Wanted Criminals">
                            <div className="w-full h-full bg-contain bg-no-repeat bg-center" style={{backgroundImage: "url('https://placehold.co/400x200/050a19/1e293b.png?text=Faces+of+Wanted+Individuals')"}}></div>
                        </DashboardWidget>
                         <DashboardWidget icon={Search} title="Vehicle Tracking">
                            <div className="w-full h-full bg-contain bg-no-repeat bg-center" style={{backgroundImage: "url('https://placehold.co/400x200/050a19/1e293b.png?text=Live+Vehicle+Tracking+Map')"}}></div>
                        </DashboardWidget>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
