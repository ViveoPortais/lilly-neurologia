import { motion } from "framer-motion";

interface ToggleSwitchProps {
 enabled: boolean;
 onChange: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onChange }) => (
 <div
  onClick={onChange}
  className={`relative w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
   enabled ? "bg-green-600" : "bg-red-600"
  }`}
 >
  <motion.div
   className="w-6 h-6 bg-white rounded-full shadow-md"
   animate={{ x: enabled ? 32 : 0 }}
   transition={{ type: "spring", stiffness: 200, damping: 20 }}
  />
  <span
   className={`absolute w-full text-sm text-white font-semibold pointer-events-none ${enabled ? "text-left pl-1.5" : "text-right pr-2"}`}
  >
   {enabled ? "Sim" : "Não"}
  </span>
 </div>
);

export default ToggleSwitch;
