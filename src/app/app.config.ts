import {ApplicationConfig} from '@angular/core';
import {provideRouter, TitleStrategy, withViewTransitions} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration} from '@angular/platform-browser';
import {provideHttpClient, withFetch, withInterceptors} from "@angular/common/http";
import {provideAnimations} from "@angular/platform-browser/animations";
import {errorInterceptor} from "@app/interceptors/error.interceptor";
import {authInterceptor} from "@app/interceptors/auth.interceptor";
import {loggerInterceptor} from "@app/interceptors/logger.interceptor";
import {MessageService} from "primeng/api";
import {TemplatePageTitleStrategy} from "@app/strategies/template-page-title.strategy";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions()),
    provideClientHydration(),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        errorInterceptor,
        authInterceptor,
        loggerInterceptor,
      ])),
    provideAnimations(),
    { provide: TitleStrategy, useClass: TemplatePageTitleStrategy },
    MessageService
  ]
};
