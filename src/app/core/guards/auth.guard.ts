import { Injectable } from "@angular/core";
import { LocalStorageService } from "ngx-webstorage";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable, of } from "rxjs";


@Injectable({
    providedIn: "root"
})
export class AuthGuard implements CanActivate {

    constructor(
        private _localStorage: LocalStorageService,
        private _router: Router
    ) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const token = this._localStorage.retrieve("token");
        if (!token) {
            this._router.navigate(["/"]);
            return of(false);
        }
        return of(true);
    }

}
