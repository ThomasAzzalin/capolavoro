export type MessageType =
    | 'messaggio_classico'
    | 'video'
    | 'sticker'
    | 'foto'
    | 'messaggio_eliminato'
    | 'audio'
    | 'videochiamata'
    | 'chiamata';

export interface ChatMessage {
    user: string;
    date: string;
    time: string;
    content: string;
    type: MessageType;
    duration?: number;
}

export function parseDuration(durationText: string): number {
    const lower = durationText.toLowerCase();
    let totalSeconds = 0;

    // conversione ore
    const oreMatch = lower.match(/(\d+)\s*or[ea]/);
    if (oreMatch) totalSeconds += parseInt(oreMatch[1], 10) * 3600;

    // conversione minuti
    const minMatch = lower.match(/(\d+)\s*minut[oi]/);
    if (minMatch) totalSeconds += parseInt(minMatch[1], 10) * 60;

    // salvataggio secondi
    const secMatch = lower.match(/(\d+)\s*second[oi]/);
    if (secMatch) totalSeconds += parseInt(secMatch[1], 10);

    return totalSeconds;
}

export function identifyMessageType(messageContent: string): [MessageType, number | null] {
    const contentLower = messageContent.trim().toLowerCase();

    // controllo per: messaggi eliminati, foto, video, audio, sticker
    if (contentLower.includes('video omesso')) return ['video', null];
    if (contentLower.includes('immagine omessa')) return ['foto', null];
    if (contentLower.includes('audio omesso')) return ['audio', null];
    if (contentLower.includes('sticker non incluso')) return ['sticker', null];
    if (contentLower.includes('questo messaggio è stato eliminato')) return ['messaggio_eliminato', null];
    if (contentLower.includes('hai eliminato questo messaggio')) return ['messaggio_eliminato', null];

    if (contentLower.includes('videochiamata')) {
        return ['videochiamata', parseDuration(messageContent)];
    }
    if (contentLower.includes('chiamata')) {
        return ['chiamata', parseDuration(messageContent)];
    }

    return ['messaggio_classico', null];
}

export function parseChatToJson(rawText: string): ChatMessage[]{
    // regex che trova l'inizio di ogni nuovo messaggio
    const messagePattern = /\[([^,]+),\s([^\]]+)\]\s([^:]+):\s/g;
    const messages: ChatMessage[] = [];

    // dividiamo il testo raw iniziale in tutti i messaggi applicando il regex
    const matches = Array.from(rawText.matchAll(messagePattern));

    for(let i=1; i<matches.length; i++){
        const match = matches[i];

        // Estraiamo i dati base puliti
        const dateStr = match[1].trim();
        const timeStr = match[2].trim();
        const user = match[3].trim();

        // calcoliamo l'inizio e la fine del testo del messaggio
        // inizio: match.index contiene l'indice dell'inizio + match[0].lenght contiene la lunghezza dell'intestazione del messaggio
        // [09/09/25, 13:56:21] pupi: 
        const startPos = match.index! + match[0].length; 
        let endPos: number;
        
        if (i + 1 < matches.length) {
            // Se esiste un messaggio successivo, fermati dove inizia quello
            endPos = matches[i + 1].index!;
        } else {
            // Se è l'ultimo messaggio, vai fino alla fine del documento
            endPos = rawText.length;
        }

        let messageContent = rawText.slice(startPos, endPos).trim();

        //rimozione caratteri invisibili e eliminazione del testo contenuto nei messaggi modificati
        messageContent = messageContent.replace(/^[\u200e‎]+/, '');
        messageContent = messageContent.replace(/[\u200e‎]+$/g, '');

        if (messageContent.endsWith('<Questo messaggio è stato modificato>')) {
            messageContent = messageContent.slice(0, -'<Questo messaggio è stato modificato>'.length).trim();
        }
        messageContent = messageContent.replace(/[\u200e‎]+$/g, '').trim();

        // Scartiamo la dicitura di sicurezza di WhatsApp
        if (messageContent.includes('crittografati end-to-end') || messageContent.includes('end-to-end encrypted')) {
            continue;
        }

        // cataloghiamo il messaggio
        const [messageType, duration] = identifyMessageType(messageContent);
        // se non è un messaggio classico il content non ci interessa
        if (messageType !== 'messaggio_classico') {
            messageContent = '';
        }

        const messageObj: ChatMessage = {
            user: user,
            date: dateStr,
            time: timeStr,
            content: messageContent,
            type: messageType,
        };

        // aggiungiamo i secondi di durata solo se la tipologia lo ammettes
        if (messageType === 'chiamata' || messageType === 'videochiamata') {
            messageObj.duration = duration ?? 0;
        }

        messages.push(messageObj);
    }

    // Restituiamo il nostro JSON perfetto e pulito
    return messages;
}

export function filterParticipants(messages: ChatMessage[]): ChatMessage[] {
    const total = messages.length;
    const counts: Record<string, number> = {};
    for (const m of messages) {
        counts[m.user] = (counts[m.user] ?? 0) + 1;
    }
    const validUsers = new Set(
        Object.entries(counts)
            .filter(([, count]) => count / total >= 0.01)
            .map(([user]) => user)
    );
    return messages.filter(m => validUsers.has(m.user));
}