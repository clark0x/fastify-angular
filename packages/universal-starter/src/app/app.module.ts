import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import { AppComponent }          from './app.component';
import { HomeComponent }         from './home/home.component';
import {TransferHttpCacheModule} from '@nguniversal/common';
import { AppLocaleModule }       from './app-locale.module';
import { AppI18nModule }         from './app-i18n.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'my-app'}),
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full'},
      { path: 'lazy', loadChildren: './lazy/lazy.module#LazyModule'},
      { path: 'lazy/nested', loadChildren: './lazy/lazy.module#LazyModule'}
    ]),
    TransferHttpCacheModule,
    AppLocaleModule,
    AppI18nModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
