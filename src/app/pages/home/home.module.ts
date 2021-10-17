import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { HomeComponent } from "./home.component";
import { MiniLandmarkComponent } from './components/mini-landmark/mini-landmark.component';
import { NgArrayPipesModule } from "ngx-pipes";
import { FormsModule } from "@angular/forms";
import { NgxDropzoneModule } from "ngx-dropzone";
import { LazyLoadImageModule } from "ng-lazyload-image";


@NgModule({
    declarations: [
        HomeComponent,
        MiniLandmarkComponent
    ],
    exports: [HomeComponent],
    imports: [
        CommonModule,
        RouterModule,
        NgArrayPipesModule,
        FormsModule,
        NgxDropzoneModule,
        LazyLoadImageModule
    ]
})
export class HomeModule { }
