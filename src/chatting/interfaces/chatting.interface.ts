export interface IChattingRedis {
    hashId: string;
    title: string;
    description: string;
    chatingType: string;
    lastMeeageSendAt: string;
    unreadCount: number;
    groupMembers: [
        {
            accountId: string;
            accountName: string;
            avatar: string;
            online: boolean;
            lastOnlieAt: string;
        }
    ]
    config: {
        background: string;
        avatar: string;
    }
    messaages: [
        {
            accountId: string;
            messageType: string;
            messageContent: string;
            sendAt: string;
            readCount: number;
        }
    ]
}

export enum VISABLE_LEVEL {
    ALVIE = 1,
    HIDE_FOR_ALL = 2,
}

export interface IChatMessage {
    accountId: string;
    messageType: string;
    messageContent: string;
    sendAt: string;
    readCount: number;
    visableLevel: boolean;
}

