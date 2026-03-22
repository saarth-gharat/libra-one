import { LucideIcon } from "lucide-react";

export default function StatCard({
  label,
  value,
  note,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  note?: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="glass-card card-pad stat-card">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
        <div>
          <div className="stat-label">{label}</div>
          <div className="stat-value">{value}</div>
          {note ? <div className="stat-note">{note}</div> : null}
        </div>

        {Icon ? (
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, rgba(99,102,241,0.16), rgba(168,85,247,0.12))",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Icon size={22} />
          </div>
        ) : null}
      </div>
    </div>
  );
}