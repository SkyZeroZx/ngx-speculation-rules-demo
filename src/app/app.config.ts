import { onViewTransitionCreated } from '@/core/animations';
import { appInitialConfig } from '@/core/config/http-cache';
import { swRegistrationOptions } from '@/core/config/service-worker';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  provideClientHydration,
  withEventReplay,
  withHttpTransferCacheOptions,
} from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  withComponentInputBinding,
  withRouterConfig,
  withViewTransitions,
} from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { provideEventPlugins } from '@taiga-ui/event-plugins';

import { routes } from './app.routes';
import { provideSpeculationRules } from 'ngx-speculation-rules';

export const appConfig: ApplicationConfig = {
  providers: [
    // Speculation Rules API - Automatic prefetching for better performance
    // Uses 'moderate' eagerness to balance performance and resource usage
    provideSpeculationRules({
      autoInsert: true,
      defaultRules: {
        prerender: [
          {
            source: 'document',
            eagerness: 'eager',
            where: {
              not: { selector_matches: '[data-render="false"]' },
            },
          },
        ],
      },
    }),
    provideAnimationsAsync(),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions({
        onViewTransitionCreated,
        skipInitialTransition: true,
      }),
      withRouterConfig({
        onSameUrlNavigation: 'reload',
      })
    ),
    provideClientHydration(withHttpTransferCacheOptions({}), withEventReplay()),
    provideServiceWorker('ngsw-worker.js', swRegistrationOptions),
    provideHttpClient(withFetch()),
    provideEventPlugins(),
    appInitialConfig,
  ],
};
