import { Timestamp } from '@angular/fire/firestore';

export interface ThreadMessage {
    id?: string;
    createdAt: Timestamp;
    senderId: string;
    text: string;
    reactions: Reaction[];
}

export interface ChannelMessage {
    id?: string;
    createdAt: Timestamp;
    senderId: string;
    text: string;
    reactions: Reaction[];
    threadMessages?: ThreadMessage[];
}

export interface Reaction {
    emojiCode: string;
    postedBy: string[]; 
    count: number;
}


