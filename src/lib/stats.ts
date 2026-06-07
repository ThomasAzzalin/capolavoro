import type { ChatMessage } from './parser';

// soglia oltre la quale un messaggio è considerato l'inizio di una nuova conversazione
const CONVERSATION_GAP_MINUTES = 180;

export interface UserCount {
    user: string;
    count: number;
}

export interface HeatmapRow {
    user: string;
    values: number[]; // 7 valori per giorno settimana, 24 per ora del giorno
}

export interface MonthCount {
    month: string;
    count: number;
}

export interface TypeCount {
    type: string;
    count: number;
}

export interface UserAvgLength {
    user: string;
    avgLength: number;
}

export interface ChatStats {
    years: number[];           // anni effettivamente inclusi nel calcolo
    availableYears: number[];  // tutti gli anni presenti nel dataset
    totalMessages: number;
    messagesByUser: UserCount[];
    weekdayHeatmap: HeatmapRow[];
    hourHeatmap: HeatmapRow[];
    messagesByMonth: MonthCount[];
    conversationStarters: UserCount[];
    messageTypes: TypeCount[];
    avgMessageLength: UserAvgLength[];
}

const MONTH_LABELS = [
    'Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu',
    'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic',
];

interface DatedMessage {
    msg: ChatMessage;
    date: Date;
}

// converte data (DD/MM/YY o DD/MM/YYYY) e ora (HH:MM:SS) in un oggetto Date
function parseTimestamp(msg: ChatMessage): Date | null {
    const dateParts = msg.date.split('/');
    if (dateParts.length !== 3) return null;

    const d = parseInt(dateParts[0], 10);
    const m = parseInt(dateParts[1], 10);
    let y = parseInt(dateParts[2], 10);
    if (Number.isNaN(d) || Number.isNaN(m) || Number.isNaN(y)) return null;
    if (y < 100) y += 2000;

    const timeParts = msg.time.split(':');
    const hh = parseInt(timeParts[0] ?? '0', 10) || 0;
    const mm = parseInt(timeParts[1] ?? '0', 10) || 0;
    const ss = parseInt(timeParts[2] ?? '0', 10) || 0;

    const date = new Date(y, m - 1, d, hh, mm, ss);
    return Number.isNaN(date.getTime()) ? null : date;
}

function enrich(messages: ChatMessage[]): DatedMessage[] {
    const result: DatedMessage[] = [];
    for (const msg of messages) {
        const date = parseTimestamp(msg);
        if (date) result.push({ msg, date });
    }
    return result;
}

export function computeStats(messages: ChatMessage[], years?: number[] | null): ChatStats {
    const all = enrich(messages);
    const availableYears = [...new Set(all.map(d => d.date.getFullYear()))].sort((a, b) => a - b);

    // se non viene passato nessun anno (o array vuoto) consideriamo tutti gli anni
    const selectedYears = years && years.length > 0 ? years : availableYears;

    const dated = all
        .filter(d => selectedYears.includes(d.date.getFullYear()))
        .sort((a, b) => a.date.getTime() - b.date.getTime());

    // messaggi per partecipante (ordinati per attività)
    const userCounts = new Map<string, number>();
    for (const d of dated) {
        userCounts.set(d.msg.user, (userCounts.get(d.msg.user) ?? 0) + 1);
    }
    const messagesByUser: UserCount[] = [...userCounts.entries()]
        .map(([user, count]) => ({ user, count }))
        .sort((a, b) => b.count - a.count);
    const users = messagesByUser.map(u => u.user);

    // heatmap giorni settimana (Lun=0 ... Dom=6) e ore (0..23)
    const weekdayMap = new Map<string, number[]>();
    const hourMap = new Map<string, number[]>();
    for (const u of users) {
        weekdayMap.set(u, new Array(7).fill(0));
        hourMap.set(u, new Array(24).fill(0));
    }
    for (const d of dated) {
        const weekday = (d.date.getDay() + 6) % 7;
        weekdayMap.get(d.msg.user)![weekday]++;
        hourMap.get(d.msg.user)![d.date.getHours()]++;
    }
    const weekdayHeatmap: HeatmapRow[] = users.map(u => ({ user: u, values: weekdayMap.get(u)! }));
    const hourHeatmap: HeatmapRow[] = users.map(u => ({ user: u, values: hourMap.get(u)! }));

    // messaggi per mese (aggregati su tutti gli anni selezionati)
    const monthCounts = new Array(12).fill(0);
    for (const d of dated) monthCounts[d.date.getMonth()]++;
    const messagesByMonth: MonthCount[] = MONTH_LABELS.map((month, i) => ({ month, count: monthCounts[i] }));

    // chi inizia le conversazioni (primo messaggio dopo un gap > soglia)
    const starterCounts = new Map<string, number>();
    let prev: Date | null = null;
    for (const d of dated) {
        const gapMs = prev ? d.date.getTime() - prev.getTime() : Infinity;
        if (gapMs > CONVERSATION_GAP_MINUTES * 60 * 1000) {
            starterCounts.set(d.msg.user, (starterCounts.get(d.msg.user) ?? 0) + 1);
        }
        prev = d.date;
    }
    const conversationStarters: UserCount[] = [...starterCounts.entries()]
        .map(([user, count]) => ({ user, count }))
        .sort((a, b) => b.count - a.count);

    // tipologia messaggi
    const typeCounts = new Map<string, number>();
    for (const d of dated) {
        typeCounts.set(d.msg.type, (typeCounts.get(d.msg.type) ?? 0) + 1);
    }
    const messageTypes: TypeCount[] = [...typeCounts.entries()]
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count);

    // lunghezza media dei messaggi di testo per persona
    const lengthSum = new Map<string, number>();
    const lengthCount = new Map<string, number>();
    for (const d of dated) {
        if (d.msg.type === 'messaggio_classico') {
            lengthSum.set(d.msg.user, (lengthSum.get(d.msg.user) ?? 0) + d.msg.content.length);
            lengthCount.set(d.msg.user, (lengthCount.get(d.msg.user) ?? 0) + 1);
        }
    }
    const avgMessageLength: UserAvgLength[] = users
        .map(u => {
            const n = lengthCount.get(u) ?? 0;
            const avg = n ? (lengthSum.get(u)! / n) : 0;
            return { user: u, avgLength: Math.round(avg * 10) / 10 };
        })
        .sort((a, b) => b.avgLength - a.avgLength);

    return {
        years: selectedYears,
        availableYears,
        totalMessages: dated.length,
        messagesByUser,
        weekdayHeatmap,
        hourHeatmap,
        messagesByMonth,
        conversationStarters,
        messageTypes,
        avgMessageLength,
    };
}

// versione che restituisce direttamente la stringa JSON, come da specifica
export function computeStatsJson(messages: ChatMessage[], years?: number[] | null): string {
    return JSON.stringify(computeStats(messages, years));
}
