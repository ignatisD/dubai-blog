import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ILandmark } from "@interfaces/Landmark";
import { LandmarksService } from "@services/landmarks.service";
import { Helpers } from "@helpers/Helpers";

@Component({
    selector: "app-mini-landmark",
    templateUrl: "./mini-landmark.component.html",
    styleUrls: ["./mini-landmark.component.scss"]
})
export class MiniLandmarkComponent implements OnInit {

    @Input() landmark: ILandmark|null = null;
    @Output() clicked: EventEmitter<ILandmark> = new EventEmitter<ILandmark>();

    public dummy: string = LandmarksService.dummy;
    public loadingDummy: string = Helpers.loadingDummy;

    constructor() {
    }

    ngOnInit(): void {
    }

    public imageClicked(ev: Event) {
        ev.preventDefault();
        if (this.landmark) {
            this.clicked.next(this.landmark);
        }
    }

}
