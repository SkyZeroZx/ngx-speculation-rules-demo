import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  Provider,
} from '@angular/core';

import { SpeculationRulesServiceConfig } from '../interfaces';
import { SpeculationRulesBrowserService } from '../services/speculation-rules-browser.service';
import {
  SPECULATION_RULES_CONFIG,
  SpeculationRulesService,
} from '../token/speculation-rules.token';

/**
 * Provides Speculation Rules Service with platform detection
 * Automatically selects browser or server implementation
 *
 * @param config - Optional configuration for the service
 * @returns Provider array for dependency injection
 *
 * @example
 * ```typescript
 * // In app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideSpeculationRules({
 *       autoInsert: true,
 *       defaultRules: {
 *         prefetch: [{
 *           source: 'document',
 *           eagerness: 'moderate'
 *         }]
 *       }
 *     })
 *   ]
 * };
 * ```
 */
export function provideSpeculationRules(
  config?: Partial<SpeculationRulesServiceConfig>
): EnvironmentProviders {
  const providers: Provider[] = [];

  // Add config provider if provided
  if (config) {
    providers.push({
      provide: SPECULATION_RULES_CONFIG,
      useValue: {
        enabled: true,
        autoInsert: false,
        ...config,
      },
    });
  }

  // Add service provider with platform detection
  providers.push({
    provide: SpeculationRulesService,
    useFactory: () => inject(SpeculationRulesBrowserService),
  });

  return makeEnvironmentProviders(providers);
}

/**
 * Convenience provider for enabling speculation rules with document-based prefetch
 * Automatically prefetches all internal links on the page
 *
 * @param eagerness - Eagerness level for prefetch (default: 'moderate')
 * @returns Provider array for dependency injection
 *
 * @example
 * ```typescript
 * // In app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideSpeculationRulesWithPrefetch('eager')
 *   ]
 * };
 * ```
 */
export function provideSpeculationRulesWithPrefetch(
  eagerness: 'immediate' | 'eager' | 'moderate' | 'conservative' = 'moderate'
): EnvironmentProviders {
  return provideSpeculationRules({
    autoInsert: true,
    defaultRules: {
      prefetch: [
        {
          source: 'document',
          eagerness,
          where: {
            and: [
              { href_matches: '/*' },
              { not: { href_matches: '/logout' } },
              { not: { href_matches: '/*\\?*logout*' } },
              { not: { selector_matches: '[rel~=nofollow]' } },
              { not: { selector_matches: '.no-speculation' } },
            ],
          },
        },
      ],
    },
  });
}

/**
 * Convenience provider for enabling speculation rules with prerender
 * Use with caution - prerendering consumes more resources
 *
 * @param eagerness - Eagerness level for prerender (default: 'conservative')
 * @returns Provider array for dependency injection
 *
 * @example
 * ```typescript
 * // In app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideSpeculationRulesWithPrerender('moderate')
 *   ]
 * };
 * ```
 */
export function provideSpeculationRulesWithPrerender(
  eagerness:
    | 'immediate'
    | 'eager'
    | 'moderate'
    | 'conservative' = 'conservative'
): EnvironmentProviders {
  return provideSpeculationRules({
    autoInsert: true,
    defaultRules: {
      prerender: [
        {
          source: 'document',
          eagerness,
          where: {
            and: [
              { href_matches: '/*' },
              { not: { href_matches: '/logout' } },
              { not: { href_matches: '/*\\?*logout*' } },
              { not: { selector_matches: '[rel~=nofollow]' } },
              { not: { selector_matches: '.no-speculation' } },
              { not: { selector_matches: '.no-prerender' } },
            ],
          },
        },
      ],
    },
  });
}
