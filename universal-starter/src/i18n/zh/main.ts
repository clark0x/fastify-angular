import { LOCALE_ID, MissingTranslationStrategy, TRANSLATIONS, TRANSLATIONS_FORMAT } from '@angular/core';
import { platformBrowserDynamic }                                                   from '@angular/platform-browser-dynamic';

import { AppModule } from '@app/app.module';

const LOCALE = 'zh';

// we use the webpack raw-loader to return the content as a string
const translations = require(`raw-loader!./locale/messages.${LOCALE}.xlf`);

document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic()
    .bootstrapModule(AppModule, {
      missingTranslation: MissingTranslationStrategy.Error,
      providers         : [
        { provide: LOCALE_ID, useValue: LOCALE },
        { provide: TRANSLATIONS, useValue: translations },
        { provide: TRANSLATIONS_FORMAT, useValue: 'xlf2' },
      ],
    })
    .catch(err => console.log(err));
});
