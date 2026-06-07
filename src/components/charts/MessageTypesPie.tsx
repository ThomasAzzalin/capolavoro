import PieChartBase from './PieChartBase';
import type { TypeCount } from '../../lib/stats';

const TYPE_LABELS: Record<string, string> = {
    messaggio_classico: 'Testo',
    foto: 'Foto',
    video: 'Video',
    audio: 'Audio',
    sticker: 'Sticker',
    messaggio_eliminato: 'Eliminati',
    videochiamata: 'Videochiamata',
    chiamata: 'Chiamata',
};

export default function MessageTypesPie({ data }: { data: TypeCount[] }) {
    return (
        <PieChartBase
            data={data.map(d => ({ name: TYPE_LABELS[d.type] ?? d.type, value: d.count }))}
        />
    );
}
