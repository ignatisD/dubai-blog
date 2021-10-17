import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { LandmarkComponent } from "./landmark.component";
import { LandmarkRoutingModule } from "./landmark-routing.module";
import { LoadingModule } from "../../core/components/loading/loading.module";
import { LazyLoadImageModule } from "ng-lazyload-image";


@NgModule({
    declarations: [
        LandmarkComponent
    ],
    exports: [LandmarkComponent],
    imports: [
        LandmarkRoutingModule,
        CommonModule,
        RouterModule,
        LoadingModule,
        LazyLoadImageModule
    ]
})
export class LandmarkModule { }
