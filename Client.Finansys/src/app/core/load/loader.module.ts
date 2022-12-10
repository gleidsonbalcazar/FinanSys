import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgxLoadingModule } from "ngx-loading";
import { LoaderComponent } from "./loader.component";

@NgModule({
  declarations: [LoaderComponent],
  exports: [LoaderComponent],
  imports: [
    CommonModule,
    NgxLoadingModule.forRoot({
      fullScreenBackdrop: true
    })
  ]
})

export class LoaderModule{}
