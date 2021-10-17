import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { IUser } from "@interfaces/User";
import { JsonResponse } from "@helpers/JsonResponse";
import { environment } from "@environments/environment";

@Injectable({
    providedIn: "root"
})
export class AuthService {

    private readonly _base: string = environment.domain;
    public user: IUser|null = null;

    constructor(
        private _httpClient: HttpClient
    ) {}

    protected _url(path: string) {
        return this._base + "/auth" + path;
    }

    public login(user: Pick<IUser, "username"|"password">): Observable<JsonResponse<IUser>> {
        try {
            return this._httpClient.post(this._url("/login"), user)
                .pipe(JsonResponse.format<IUser>());
        } catch (e) {
            return of(JsonResponse.caught(e));
        }
    }

    public logout(): Observable<JsonResponse<boolean>> {
        try {
            return this._httpClient.post(this._url("/logout"), null)
            .pipe(JsonResponse.format<boolean>());
        } catch (e) {
            return of(JsonResponse.caught(e));
        }
    }

    public status(): Observable<JsonResponse<IUser>> {
        try {
            return this._httpClient.get(this._url("/status"))
                .pipe(JsonResponse.format<IUser>());
        } catch (e) {
            return of(JsonResponse.caught(e));
        }
    }

}



