import { LOCALE_ID, NgModule } from '@angular/core';

@NgModule({
  providers: [
    { provide: LOCALE_ID, useValue: 'en' },
  ],
})
export class AppLocaleModule {
}
