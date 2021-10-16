import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { LocalStorageService } from "ngx-webstorage";
import { Observable } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private _localStorage: LocalStorageService
    ) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let request = req;
        const token = this._localStorage.retrieve("token");
        if (token && !req.headers.get("token")) {
            request = req.clone({
                setHeaders: {
                    token: token
                }
            });
        }
        return next.handle(request);
    }

}
