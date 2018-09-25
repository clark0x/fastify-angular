import { LOCALE_ID, MissingTranslationStrategy, NgModule, TRANSLATIONS, TRANSLATIONS_FORMAT } from '@angular/core';
import { I18n, MISSING_TRANSLATION_STRATEGY }                                                 from '@ngx-translate/i18n-polyfill';

export function loadTranslations(locale) {
  locale = locale || 'en'; // default to english if no locale provided
  return require(`raw-loader!../locale/runtime/messages.${locale}.xlf`);
}

@NgModule({
  providers: [
    { provide: TRANSLATIONS, useFactory: (loadTranslations), deps: [LOCALE_ID] },
    { provide: TRANSLATIONS_FORMAT, useValue: 'xlf2' },
    { provide: MISSING_TRANSLATION_STRATEGY, useValue: MissingTranslationStrategy.Error },
    I18n,
  ],
})
export class AppI18nModule {
}
