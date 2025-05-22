import { Timestamp } from '@angular/fire/firestore';
import { ChannelMessage } from './message.interface';

export interface Channel {
    id?: string;
    createdAt: Timestamp;
    members: string[];
    channelName: string;
    channelMessages: ChannelMessage[];
}