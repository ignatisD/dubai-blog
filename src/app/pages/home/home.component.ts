import { cloneDeep, pick } from "lodash";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { ILandmark } from "@interfaces/Landmark";
import { LandmarksService } from "@services/landmarks.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "@services/auth.service";
import { JsonResponse } from "@helpers/JsonResponse";
import { Helpers } from "@helpers/Helpers";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {

    public loading: boolean = false;
    public landmarks: ILandmark[] = [];

    public landmark: ILandmark|null = null;
    public loaded: boolean = false;

    public landmarkEditable: ILandmark|null = null;
    public landmarkEditableLoaded: boolean = false;
    public canUploadImage: boolean = false;

    public dummy: string = LandmarksService.dummy;
    public dummyFull: string = LandmarksService.dummyFull;
    public loadingDummy: string = Helpers.loadingDummy;

    public landmarkFiles: File[] = [];

    constructor(
        private _landmarksService: LandmarksService,
        private _toastrService: ToastrService,
        public modalService: NgbModal,
        public authService: AuthService
    ) {
    }

    ngOnInit(): void {
        this.landmarks = [];
        this.loading = true;
        this._landmarksService.retrieve().subscribe(res => {
            if (res.success) {
                this.landmarks = res.get();
            } else {
                console.error(res.errors);
                this._toastrService.error("Something went wrong");
            }
        }, (err) => {
            console.error(err);
            this._toastrService.error("Something went wrong");
        }, () => {
            this.loading = false;
        })
    }

    public async saveLandmark(modal: NgbModalRef, landmark: ILandmark|null = null) {
        if (!landmark) {
            return;
        }
        this.loading = true;
        const canBeUpdated = ["title", "short_info", "description", "url"];
        this._landmarksService.updateOne(landmark.objectId, pick(landmark, canBeUpdated)).toPromise()
            .then(res => {
                if (!res.success) {
                    console.error(res.errors);
                    this._toastrService.error("Something went wrong");
                    return;
                }
                this._toastrService.success("Update successful");
                Object.assign(this.landmark, res.get());
                modal.close(true);
            })
            .catch(err => {
                console.error(err);
                this._toastrService.error("Something went wrong");
            }).then(() => {
                this.loading = false;
            });
    }

    public handleLandmark(modal: TemplateRef<any>, landmark: ILandmark) {
        this.landmark = landmark;
        this.landmarkEditable = cloneDeep(landmark);
        this.modalService
            .open(modal, {size: "xl"}).result
            .then((result: boolean) => {
                return new JsonResponse<boolean>().ok(result);
            }).catch(reason => {
                return new JsonResponse<ILandmark>().error(reason || "Dismissed");
            }).then(async (res) => {
                this.landmark = null;
                this.landmarkEditable = null;
                this.canUploadImage = false;
                this.landmarkFiles = [];
            });
    }

    public filesChanged(event: any) {
        if (this.landmarkFiles.length >= 1) {
            return;
        }
        this.canUploadImage = false;
        if (event.addedFiles?.length) {
            this.landmarkFiles.push(...event.addedFiles);
        }
        if (event.rejectedFiles?.length) {
            for (const f of event.rejectedFiles) {
                if (f.reason === "size") {
                    this._toastrService.error("The system does not allow photos larger than 5MB to be uploaded");
                }
            }
        }
        if (this.landmarkFiles.length) {
            this.canUploadImage = true;
        }
    }

    public remove(index: number) {
        this.landmarkFiles.splice(index, 1);
        this.canUploadImage = false;
    }

    public clearImage(landmarkId: string) {
        this.loading = true;
        this._landmarksService.updateOne(landmarkId, {photo: null, photo_thumb: null}).toPromise()
        .then(res => {
            if (!res.success) {
                console.error(res.errors);
                this._toastrService.error(res.reason());
                return;
            }
            this._toastrService.success("Photo cleared successful");
            this.updatePhoto(res.get());
        })
        .catch(err => {
            console.error(err);
            this._toastrService.error("Something went wrong");
        }).then(() => {
            this.loading = false;
        });
    }

    public updatePhoto(landmark: ILandmark) {
        if (this.landmark) {
            this.landmark.photo = landmark.photo;
            this.landmark.photo_thumb = landmark.photo_thumb;
        }
        if (this.landmarkEditable) {
            this.landmarkEditable.photo = landmark.photo;
            this.landmarkEditable.photo_thumb = landmark.photo_thumb;
        }

    }

    public upload(landmarkId: string) {
        this.loading = true;
        const formData = new FormData();
        formData.append("photo", this.landmarkFiles[0]);
        this._landmarksService.upload(landmarkId, formData).subscribe(res => {
            if (!res.success) {
                console.error(res.errors);
                this._toastrService.error(res.reason());
                return;
            }
            this._toastrService.success("Upload successful");
            this.updatePhoto(res.get());
        }, (err) => {
            console.error(err);
            this._toastrService.error("Something went wrong");
        }, () => {
            this.loading = false;
            this.landmarkFiles = [];
            this.canUploadImage = false;
        });
    }
}
