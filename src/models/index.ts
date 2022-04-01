
export interface Discussion {
    user: string;
    messages: PopulatedMessage[];
}

export interface Conversation {
    userId:string;
    avatar: string;
    username: string;
    message: string;
}

export interface PopulatedMessage {
    id: string
    sender: User
    receiver: User
    type: string
    message: string
    discussionId: string
    seen: string
    createdAt: string
    messageType: MessageType
}


export interface User {
    _id: string
    avatar: string
    createdAt: string
    email: string
    firstName: string
    lastName: string
    password: string
    phone: string
    updatedAt: string
    verified: number

}


export enum MessageType {
    sent,
    received
}

