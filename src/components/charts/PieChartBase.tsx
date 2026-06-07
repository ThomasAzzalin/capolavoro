import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { colorFor } from './palette';

export interface PieDatum {
    name: string;
    value: number;
}

// base riusata dai vari grafici a torta
export default function PieChartBase({ data }: { data: PieDatum[] }) {
    return (
        <ResponsiveContainer width="100%" height={280}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                >
                    {data.map((_, i) => (
                        <Cell key={i} fill={colorFor(i)} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
        </ResponsiveContainer>
    );
}
