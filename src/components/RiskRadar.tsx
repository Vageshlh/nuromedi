import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface RiskRadarProps {
  data: {
    cardiovascular: number;
    infection: number;
    neurological: number;
    respiratory: number;
    systemicStress: number;
  };
}

export const RiskRadar: React.FC<RiskRadarProps> = ({ data }) => {
  const chartData = [
    { subject: 'Cardio', A: data.cardiovascular, fullMark: 100 },
    { subject: 'Infection', A: data.infection, fullMark: 100 },
    { subject: 'Neuro', A: data.neurological, fullMark: 100 },
    { subject: 'Resp', A: data.respiratory, fullMark: 100 },
    { subject: 'Stress', A: data.systemicStress, fullMark: 100 },
  ];

  return (
    <div className="w-full h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="#ffffff20" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff60', fontSize: 10 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Risk"
            dataKey="A"
            stroke="#00f0ff"
            fill="#00f0ff"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
