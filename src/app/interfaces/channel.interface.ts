import { Timestamp } from '@angular/fire/firestore';
import { ChannelMessageInterface } from './message.interface';

export interface ChannelInterface {
    id?: string;
    createdAt: Timestamp;
    members: string[];
    channelName: string;
    channelMessages: ChannelMessageInterface[];
}