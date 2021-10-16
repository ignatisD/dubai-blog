import { IError } from "./Error";

export interface IResponse<T = any> {
    success: boolean;
    key: string;
    errors?: IError[];
    [key: string]: T | any;
}
