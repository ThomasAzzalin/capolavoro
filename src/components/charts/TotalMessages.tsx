export default function TotalMessages({ total }: { total: number }) {
    return (
        <div className="total-messages">
            <span className="total-number">{total.toLocaleString('it-IT')}</span>
            <span className="total-label">messaggi totali</span>
        </div>
    );
}
