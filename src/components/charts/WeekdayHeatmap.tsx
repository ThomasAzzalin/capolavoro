import HeatmapGrid from './HeatmapGrid';
import type { HeatmapRow } from '../../lib/stats';

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

export default function WeekdayHeatmap({ data }: { data: HeatmapRow[] }) {
    return <HeatmapGrid data={data} columnLabels={WEEKDAYS} />;
}
