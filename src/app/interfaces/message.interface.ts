import { Timestamp } from '@angular/fire/firestore';

export interface ThreadMessageInterface {
    id?: string;
    createdAt: Timestamp;
    senderId: string;
    text: string;
    reactions: ReactionInterface[];
    mentions?: string[];
}

export interface ChannelMessageInterface {
    id?: string;
    createdAt: Timestamp;
    senderId: string;
    text: string;
    reactions: ReactionInterface[];
    threadMessages?: ThreadMessageInterface[];
    mentions?: string[];
}

export interface ReactionInterface {
    emojiCode: string;
    postedBy: string[]; 
    count: number;
}

export interface DirectMessageInterface {
    id?: string;
    createdAt: Timestamp;
    senderId: string;
    text: string;
    reactions: ReactionInterface[];
    mentions?: string[];
    replyTo?: string;
}

