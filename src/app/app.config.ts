import { onViewTransitionCreated } from '@/core/animations';
import { appInitialConfig } from '@/core/config/http-cache';
import { swRegistrationOptions } from '@/core/config/service-worker';
import { provideContextService } from '@/services/context';
import { provideSpeculationRulesWithPrefetch, provideSpeculationRulesWithPrerender } from '@/services/speculation-rules';
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

export const appConfig: ApplicationConfig = {
  providers: [
    // Speculation Rules API - Automatic prefetching for better performance
    // Uses 'moderate' eagerness to balance performance and resource usage
    provideSpeculationRulesWithPrerender('moderate'),
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
    provideContextService(),
    provideEventPlugins(),
    appInitialConfig,
  ],
};
