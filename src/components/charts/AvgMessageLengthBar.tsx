import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { UserAvgLength } from '../../lib/stats';
import { colorFor } from './palette';

export default function AvgMessageLengthBar({ data }: { data: UserAvgLength[] }) {
    return (
        <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} margin={{ left: 0, right: 16, top: 8, bottom: 8 }}>
                <XAxis
                    dataKey="user"
                    tick={{ fontSize: 11 }}
                    interval={0}
                    angle={-30}
                    textAnchor="end"
                    height={60}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [`${v} caratteri`, 'Media']} />
                <Bar dataKey="avgLength" radius={[3, 3, 0, 0]}>
                    {data.map((_, i) => (
                        <Cell key={i} fill={colorFor(i)} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
