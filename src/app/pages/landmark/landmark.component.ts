import { Component, isDevMode, OnInit } from "@angular/core";
import { ILandmark } from "@interfaces/Landmark";
import { LandmarksService } from "@services/landmarks.service";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ResponseError } from "@helpers/ResponseError";
import { IError } from "@interfaces/Error";
import { Helpers } from "@helpers/Helpers";

@Component({
    selector: "app-landmark",
    templateUrl: "./landmark.component.html",
    styleUrls: ["./landmark.component.scss"]
})
export class LandmarkComponent implements OnInit {

    public loading: boolean = false;
    public loaded: boolean = false;
    public landmark: ILandmark|null = null;
    public dummy: string = LandmarksService.dummyFull;
    public loadingDummy: string = Helpers.loadingDummy;

    public error: IError|null = null;

    constructor(
        public landmarksService: LandmarksService,
        public activatedRoute: ActivatedRoute,
        public toastService: ToastrService
    ) {
    }

    ngOnInit(): void {
        const landmarkId: string = this.activatedRoute.snapshot.params?.objectId;
        this.loading = true;
        this.error = null;
        this.landmarksService.findOne(landmarkId).subscribe(res => {
            if (!res.success) {
                this.errorHandler(res.reason(), "ResponseError", true);
                return;
            }
            this.landmark = res.get();
        }, (err) => {
            this.errorHandler(undefined, "HttpError", true);
        }, () => {
            this.loading = false;
        })
    }

    public errorHandler(message: string = "Something went wrong", type: string = "Error", toast: boolean = false) {
        this.error = new ResponseError(type, message);
        if (isDevMode()) {
            console.log(this.error);
        }
        if (toast) {
            this.toastService.error(this.error.message);
        }
    }

}
