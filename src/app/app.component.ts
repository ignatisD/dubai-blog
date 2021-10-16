import { Component, OnInit } from "@angular/core";
import { AuthService } from "./core/services/auth.service";
import { LocalStorageService } from "ngx-webstorage";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {

    constructor(
        private _localStorage: LocalStorageService,
        private _authService: AuthService
    ) {
    }

    ngOnInit() {
        const token = this._localStorage.retrieve("token");
        if (token) {
            this.status();
        }
    }

    public status() {
        this._authService.status().subscribe(res => {
            if (!res.success) {
                return;
            }
            this._authService.user = res.get();
        })
    }
}
