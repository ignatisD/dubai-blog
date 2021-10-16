import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { JsonResponse } from "../helpers/JsonResponse";
import { IResponse } from "../interfaces/Response";
import { ILandmark } from "../interfaces/Landmark";
import { Observable, of } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class LandmarksService {

    private readonly _base: string = "/api"

    constructor(
        private _httpClient: HttpClient
    ) {}

    protected _url(path: string) {
        return this._base + "/landmarks" + path;
    }

    public retrieve(filters?: object): Observable<IResponse<ILandmark[]>> {
        try {
            return this._httpClient.post(this._url("/" ), filters)
                .pipe(JsonResponse.format<ILandmark[]>());
        } catch (e) {
            return of(JsonResponse.caught(e));
        }
    }

    public findOne(objectId: string, filters?: object): Observable<IResponse<ILandmark>> {
        try {
            return this._httpClient.post(this._url("/" + objectId), filters)
                .pipe(JsonResponse.format<ILandmark>());
        } catch (e) {
            return of(JsonResponse.caught(e));
        }
    }

    public updateOne(objectId: string, landmark: Partial<ILandmark>): Observable<IResponse<ILandmark>> {
        try {
            return this._httpClient.put(this._url("/" + objectId), landmark)
                .pipe(JsonResponse.format<ILandmark>());
        } catch (e) {
            return of(JsonResponse.caught(e));
        }
    }

    public upload(objectId: string, image: any): Observable<IResponse<ILandmark>> {
        try {
            return this._httpClient.put(this._url("/upload/" + objectId), image)
                .pipe(JsonResponse.format<ILandmark>());
        } catch (e) {
            return of(JsonResponse.caught(e));
        }
    }
}
