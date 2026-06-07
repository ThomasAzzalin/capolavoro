import { useMemo, useState } from 'react';
import type { ChatMessage } from '../lib/parser';
import { computeStatsJson, type ChatStats } from '../lib/stats';
import Card from './Card';
import TotalMessages from './charts/TotalMessages';
import MessagesByUserPie from './charts/MessagesByUserPie';
import MessageTypesPie from './charts/MessageTypesPie';
import ConversationStartersPie from './charts/ConversationStartersPie';
import AvgMessageLengthBar from './charts/AvgMessageLengthBar';
import MessagesByMonthRadar from './charts/MessagesByMonthRadar';
import WeekdayHeatmap from './charts/WeekdayHeatmap';
import HourHeatmap from './charts/HourHeatmap';

export default function StatsDashboard({ messages }: { messages: ChatMessage[] }) {
    // array vuoto = tutti gli anni; più anni selezionati = anni combinati
    const [selectedYears, setSelectedYears] = useState<number[]>([]);

    const stats = useMemo<ChatStats>(
        () => JSON.parse(computeStatsJson(messages, selectedYears)) as ChatStats,
        [messages, selectedYears],
    );

    function toggleYear(year: number) {
        setSelectedYears(prev =>
            prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year],
        );
    }

    return (
        <div className="dashboard">
            <div className="year-selector">
                <span className="year-label">Anno:</span>
                <button
                    className={selectedYears.length === 0 ? 'active' : ''}
                    onClick={() => setSelectedYears([])}
                >
                    Tutti
                </button>
                {stats.availableYears.map(year => (
                    <button
                        key={year}
                        className={selectedYears.includes(year) ? 'active' : ''}
                        onClick={() => toggleYear(year)}
                    >
                        {year}
                    </button>
                ))}
            </div>

            <TotalMessages total={stats.totalMessages} />

            <div className="cards-grid">
                <Card title="Messaggi per partecipante">
                    <MessagesByUserPie data={stats.messagesByUser} />
                </Card>
                <Card title="Tipologia di messaggi">
                    <MessageTypesPie data={stats.messageTypes} />
                </Card>
                <Card title="Chi inizia le conversazioni">
                    <ConversationStartersPie data={stats.conversationStarters} />
                </Card>
                <Card title="Lunghezza media dei messaggi">
                    <AvgMessageLengthBar data={stats.avgMessageLength} />
                </Card>
                <Card title="Messaggi per mese" wide>
                    <MessagesByMonthRadar data={stats.messagesByMonth} />
                </Card>
                <Card title="Attività per giorno della settimana" wide>
                    <WeekdayHeatmap data={stats.weekdayHeatmap} />
                </Card>
                <Card title="Attività per ora del giorno" wide>
                    <HourHeatmap data={stats.hourHeatmap} />
                </Card>
            </div>
        </div>
    );
}
