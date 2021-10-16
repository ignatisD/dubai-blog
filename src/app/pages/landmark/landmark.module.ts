import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { LandmarkComponent } from "./landmark.component";
import { LandmarkRoutingModule } from "./landmark-routing.module";


@NgModule({
    declarations: [
        LandmarkComponent
    ],
    exports: [LandmarkComponent],
    imports: [
        LandmarkRoutingModule,
        CommonModule,
        RouterModule
    ]
})
export class LandmarkModule { }
