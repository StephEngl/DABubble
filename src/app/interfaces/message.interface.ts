import { Timestamp } from '@angular/fire/firestore';

export interface ThreadMessageInterface {
    id?: string;
    createdAt: Timestamp;
    senderId: string;
    text: string;
    reactions: ReactionInterface[];
}

export interface ChannelMessageInterface {
    id?: string;
    createdAt: Timestamp;
    senderId: string;
    text: string;
    reactions: ReactionInterface[];
    threadMessages?: ThreadMessageInterface[];
}

export interface ReactionInterface {
    emojiCode: string;
    postedBy: string[]; 
    count: number;
}


