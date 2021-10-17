import { Component, OnInit } from "@angular/core";
import { AuthService } from "@services/auth.service";
import { LocalStorageService } from "ngx-webstorage";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { IError } from "@interfaces/Error";
import { ResponseError } from "@helpers/ResponseError";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {

    public username: string = "";
    public password: string = "";

    public error: IError|null = null;

    constructor(
        private _localStorage: LocalStorageService,
        public modalService: NgbModal,
        public authService: AuthService,
        public toastService: ToastrService
    ) {
    }

    ngOnInit() {
        const token = this._localStorage.retrieve("token");
        if (token) {
            this.status();
        }
    }

    public status() {
        this.authService.status().subscribe(res => {
            if (!res.success) {
                return;
            }
            this.authService.user = res.get();
        })
    }

    public setToken(token: string|null) {
        if (token) {
            this._localStorage.store("token", token);
        } else {
            this._localStorage.clear("token");
        }
    }

    public reset() {
        this.username = "";
        this.password = "";
    }

    public login(modal: NgbActiveModal) {
        this.error = null;
        this.authService.login({username: this.username, password: this.password}).subscribe(res => {
            if (!res.success) {
                this.error = res.errors?.[0] ?? new ResponseError("LoginError", "Failed to login");
                return;
            }
            this.authService.user = res.get();
            if (this.authService.user?.sessionToken) {
                this.setToken(this.authService.user.sessionToken);
            }
            this.reset();
            modal.close(true);
            this.toastService.success(`Welcome ${this.authService.user.username}!`)
        }, () => {
            this.error = new ResponseError("HttpError", "Something went wrong");
            this.toastService.error(this.error.message);
        });
    }

    public logout() {
        const username = this.authService.user?.username;
        this.authService.logout().subscribe(res => {
            this.authService.user = null;
            this.setToken(null);
            this.toastService.success(`Goodbye ${username}!`)
        }, () => {
            this.error = new ResponseError("HttpError", "Something went wrong");
            this.toastService.error(this.error.message);
        })
    }
}
