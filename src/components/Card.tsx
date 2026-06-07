import type { ReactNode } from 'react';

interface Props {
    title: string;
    children: ReactNode;
    wide?: boolean;
}

export default function Card({ title, children, wide }: Props) {
    return (
        <section className={`card${wide ? ' card-wide' : ''}`}>
            <h3 className="card-title">{title}</h3>
            <div className="card-body">{children}</div>
        </section>
    );
}
