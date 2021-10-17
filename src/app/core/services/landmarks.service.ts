import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { JsonResponse } from "@helpers/JsonResponse";
import { ILandmark } from "@interfaces/Landmark";
import { Observable, of } from "rxjs";
import { environment } from "@environments/environment";

@Injectable({
    providedIn: "root"
})
export class LandmarksService {

    public static dummy: string = "/assets/img/placeholder.svg";
    public static dummyFull: string = "/assets/img/placeholder-full.svg";

    private readonly _base: string = environment.domain;

    constructor(
        private _httpClient: HttpClient
    ) {}

    protected _url(path: string) {
        return this._base + "/landmarks" + path;
    }

    public retrieve(filters?: object): Observable<JsonResponse<ILandmark[]>> {
        try {
            return this._httpClient.get(this._url("/" ), filters)
                .pipe(JsonResponse.format<ILandmark[]>());
        } catch (e) {
            return of(JsonResponse.caught(e));
        }
    }

    public findOne(objectId: string, filters?: object): Observable<JsonResponse<ILandmark>> {
        try {
            return this._httpClient.get(this._url("/" + objectId), filters)
                .pipe(JsonResponse.format<ILandmark>());
        } catch (e) {
            return of(JsonResponse.caught(e));
        }
    }

    public updateOne(objectId: string, landmark: Partial<ILandmark>): Observable<JsonResponse<ILandmark>> {
        try {
            return this._httpClient.put(this._url("/" + objectId), landmark)
                .pipe(JsonResponse.format<ILandmark>());
        } catch (e) {
            return of(JsonResponse.caught(e));
        }
    }

    public upload(objectId: string, image: any): Observable<JsonResponse<ILandmark>> {
        try {
            return this._httpClient.put(this._url("/upload/" + objectId), image)
                .pipe(JsonResponse.format<ILandmark>());
        } catch (e) {
            return of(JsonResponse.caught(e));
        }
    }
}
