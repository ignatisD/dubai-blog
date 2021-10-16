import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MainComponent } from "./main.component";


@NgModule({
    declarations: [
        MainComponent
    ],
    exports: [MainComponent],
    imports: [
        CommonModule,
        RouterModule
    ]
})
export class MainModule { }
