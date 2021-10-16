import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LandmarkComponent } from "./landmark.component";

const routes: Routes = [
    {
        path: ":objectId",
        component: LandmarkComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LandmarkRoutingModule { }
