"use client";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface RiskRadarProps {
  data: {
    "Data Protection": number;
    "Indemnification": number;
    "Termination": number;
    "Compliance": number;
    "Governance": number;
  };
}

export default function RiskRadar({ data }: RiskRadarProps) {
  const chartData = [
    { subject: 'Data Protection', A: data["Data Protection"], fullMark: 100 },
    { subject: 'Indemnification', A: data["Indemnification"], fullMark: 100 },
    { subject: 'Termination', A: data["Termination"], fullMark: 100 },
    { subject: 'Compliance', A: data["Compliance"], fullMark: 100 },
    { subject: 'Governance', A: data["Governance"], fullMark: 100 },
  ];

  return (
    <div className="h-64 w-full bg-zinc-900 rounded-xl p-4 border border-zinc-800 shadow-xl">
      <h3 className="text-zinc-200 font-semibold mb-2">Risk Distribution</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="#3f3f46" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar name="Risk" dataKey="A" stroke="#ef4444" fill="#ef4444" fillOpacity={0.4} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
