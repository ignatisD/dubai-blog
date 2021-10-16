import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AuthInterceptor } from "./core/interceptors/HttpInterceptor";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxWebstorageModule } from "ngx-webstorage";
import { environment } from "../environments/environment";
import { ToastrModule } from "ngx-toastr";
import { HomeModule } from "./pages/home/home.module";
import { MainModule } from "./core/layouts/main/main.module";
import { PageNotFoundModule } from "./pages/page-not-found/page-not-found.module";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        HttpClientModule,
        HomeModule,
        MainModule,
        NgbModule,
        NgxWebstorageModule.forRoot({
            prefix: environment.webStoragePrefix
        }),
        PageNotFoundModule,
        ToastrModule.forRoot(),
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
