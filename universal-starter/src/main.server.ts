import { enableProdMode } from '@angular/core';

import { environment } from '@app/env';

if (environment.production) {
  enableProdMode();
}

export {AppServerModule} from './app/app.server.module';
