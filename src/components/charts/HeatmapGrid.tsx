import { Fragment } from 'react';
import type { HeatmapRow } from '../../lib/stats';
import { HEATMAP_RGB } from './palette';

interface Props {
    data: HeatmapRow[];
    columnLabels: string[];
}

// griglia heatmap riusata da WeekdayHeatmap e HourHeatmap
export default function HeatmapGrid({ data, columnLabels }: Props) {
    const max = Math.max(1, ...data.flatMap(r => r.values));

    return (
        <div
            className="heatmap"
            style={{ gridTemplateColumns: `minmax(70px, auto) repeat(${columnLabels.length}, 1fr)` }}
        >
            <div className="heatmap-corner" />
            {columnLabels.map(label => (
                <div key={label} className="heatmap-col-label">{label}</div>
            ))}

            {data.map(row => (
                <Fragment key={row.user}>
                    <div className="heatmap-row-label" title={row.user}>{row.user}</div>
                    {row.values.map((v, i) => (
                        <div
                            key={i}
                            className="heatmap-cell"
                            style={{
                                backgroundColor: v === 0
                                    ? 'transparent'
                                    : `rgba(${HEATMAP_RGB}, ${0.12 + 0.88 * (v / max)})`,
                            }}
                            title={`${row.user} — ${columnLabels[i]}: ${v}`}
                        />
                    ))}
                </Fragment>
            ))}
        </div>
    );
}
