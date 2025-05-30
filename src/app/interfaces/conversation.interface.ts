import { DirectMessageInterface } from './message.interface';

export interface ConversationInterface {
    id?: string;
    participants: string[];
    messages?: DirectMessageInterface[]; 
}
