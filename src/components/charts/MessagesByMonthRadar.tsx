import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import type { MonthCount } from '../../lib/stats';
import { colorFor } from './palette';

// grafico a stella (radar) dei messaggi per mese
export default function MessagesByMonthRadar({ data }: { data: MonthCount[] }) {
    const color = colorFor(0);
    return (
        <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={data} outerRadius={100}>
                <PolarGrid />
                <PolarAngleAxis dataKey="month" tick={{ fontSize: 12 }} />
                <Radar dataKey="count" stroke={color} fill={color} fillOpacity={0.5} />
                <Tooltip />
            </RadarChart>
        </ResponsiveContainer>
    );
}
