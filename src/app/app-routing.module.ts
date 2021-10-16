import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainComponent } from "./core/layouts/main/main.component";
import { HomeComponent } from "./pages/home/home.component";
import { PageNotFoundComponent } from "./pages/page-not-found/page-not-found.component";

const routes: Routes = [
    {
        path: "",
        component: MainComponent,
        children: [
            {
                path: "",
                component: HomeComponent
            },
            {
                path: "landmark",
                loadChildren: () => import("./pages/landmark/landmark.module").then(m => m.LandmarkModule)
            },
            {
                path: "**",
                component: PageNotFoundComponent
            }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
