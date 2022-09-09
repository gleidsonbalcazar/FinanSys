import { ModuleWithProviders, NgModule }      from '@angular/core';
import { GrdFilterPipe } from './grd-pipe';

 @NgModule({
     imports:        [],
     declarations:   [GrdFilterPipe],
     exports:        [GrdFilterPipe],
 })

 export class PipeModule {

   static forRoot(): ModuleWithProviders<PipeModule> {
    return {
        ngModule: PipeModule,
        providers: [],
    };
}
 }
