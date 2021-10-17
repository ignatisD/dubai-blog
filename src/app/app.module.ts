import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AuthInterceptor } from "@interceptors/HttpInterceptor";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxWebstorageModule } from "ngx-webstorage";
import { environment } from "@environments/environment";
import { ToastrModule } from "ngx-toastr";
import { HomeModule } from "@pages/home/home.module";
import { PageNotFoundModule } from "@pages/page-not-found/page-not-found.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { LoadingModule } from "@components/loading/loading.module";
import { LazyLoadImageModule, LAZYLOAD_IMAGE_HOOKS, ScrollHooks } from "ng-lazyload-image";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        HomeModule,
        LazyLoadImageModule,
        LoadingModule,
        NgbModule,
        NgxWebstorageModule.forRoot({
            prefix: environment.webStoragePrefix
        }),
        PageNotFoundModule,
        ToastrModule.forRoot(),
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: LAZYLOAD_IMAGE_HOOKS, useClass: ScrollHooks }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
