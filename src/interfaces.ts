export enum Schedules {
    '24/7',
    '09:00-17:00'
}

export interface Instance {
    accountId: string,
    name: string,
    id: string,
    region: string
}

export interface InstanceGroups {
    [key: string]: Instance[]
}
