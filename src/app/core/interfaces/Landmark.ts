import { IFile } from "./File";

export interface ILandmark {
    objectId: string;
    title: string;
    description: string;
    location: [number, number];
    short_info: string;
    url: string;
    order: number;
    photo: IFile|any;
    photo_thumb: IFile|any;
}
