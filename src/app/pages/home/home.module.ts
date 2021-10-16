import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { HomeComponent } from "./home.component";


@NgModule({
    declarations: [
        HomeComponent
    ],
    exports: [HomeComponent],
    imports: [
        CommonModule,
        RouterModule
    ]
})
export class HomeModule { }
