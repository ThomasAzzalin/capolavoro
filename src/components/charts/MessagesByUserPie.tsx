import PieChartBase from './PieChartBase';
import type { UserCount } from '../../lib/stats';

export default function MessagesByUserPie({ data }: { data: UserCount[] }) {
    return <PieChartBase data={data.map(d => ({ name: d.user, value: d.count }))} />;
}
