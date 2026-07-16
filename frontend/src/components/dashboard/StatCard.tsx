import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: string;
};

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "#2563EB",
}: StatCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm">{title}</p>

          <h2 className="text-3xl font-bold mt-2 text-white">
            {value}
          </h2>

          {subtitle && (
            <p className="text-xs mt-2 text-slate-500">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center"
          style={{
            backgroundColor: color + "22",
          }}
        >
          <Icon
            size={30}
            style={{
              color,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;