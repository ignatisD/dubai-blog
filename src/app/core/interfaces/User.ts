export interface IUser {
    objectId: string;
    username: string;
    password: string
    email: string;
    phone: string;
    sessionToken?: string;
    ACL: object;
    createdAt: string | Date;
    updatedAt: string | Date;
}
