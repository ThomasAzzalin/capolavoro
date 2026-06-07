import HeatmapGrid from './HeatmapGrid';
import type { HeatmapRow } from '../../lib/stats';

const HOURS = Array.from({ length: 24 }, (_, i) => String(i));

export default function HourHeatmap({ data }: { data: HeatmapRow[] }) {
    return <HeatmapGrid data={data} columnLabels={HOURS} />;
}
