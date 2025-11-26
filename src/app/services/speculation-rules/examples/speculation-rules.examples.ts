/**
 * Example integration of Speculation Rules Service
 * 
 * This file demonstrates different ways to integrate the Speculation Rules API
 * into your Angular application based on different use cases.
 */

import { ApplicationConfig, isDevMode } from '@angular/core';
import { 
  provideSpeculationRules,
  provideSpeculationRulesWithPrefetch,
  provideSpeculationRulesWithPrerender,
  SpeculationRules
} from '@/services/speculation-rules';

// ============================================================================
// EXAMPLE 1: Basic Configuration (Manual Control)
// ============================================================================
export const basicConfig: ApplicationConfig = {
  providers: [
    provideSpeculationRules({
      enabled: !isDevMode(), // Only in production
      autoInsert: false,      // Manual control via service
      debug: isDevMode(),     // Debug logs in development
    }),
  ],
};

// ============================================================================
// EXAMPLE 2: Auto-Prefetch for E-commerce
// ============================================================================
export const ecommerceConfig: ApplicationConfig = {
  providers: [
    provideSpeculationRulesWithPrefetch('moderate'),
    // This automatically prefetches all internal links with moderate eagerness
    // Perfect for e-commerce sites where users browse many product pages
  ],
};

// ============================================================================
// EXAMPLE 3: Custom Rules for Blog/News Site
// ============================================================================
const blogSpeculationRules: SpeculationRules = {
  // Prefetch all article links
  prefetch: [
    {
      source: 'document',
      eagerness: 'moderate',
      where: {
        and: [
          { href_matches: '/articles/*' },
          { not: { selector_matches: '[rel~=nofollow]' } },
        ],
      },
    }  
  ],
  // Prerender only featured articles (conservative to save resources)
  prerender: [
    {
      source: 'document',
      eagerness: 'conservative',
      where: {
        selector_matches: '.featured-article a',
      },
    }  
  ],
};

export const blogConfig: ApplicationConfig = {
  providers: [
    provideSpeculationRules({
      enabled: true,
      autoInsert: true,
      defaultRules: blogSpeculationRules,
      debug: isDevMode(),
    }),
  ],
};

// ============================================================================
// EXAMPLE 4: Aggressive Prefetch for SPA-like Experience
// ============================================================================
const aggressivePrefetchRules: SpeculationRules = {
  prefetch: [
    {
      source: 'document',
      eagerness: 'eager', // Prefetch as soon as link is visible
      where: {
        and: [
          { href_matches: '/*' }, // All same-origin links
          // Exclude patterns that should NOT be prefetched
          { not: { href_matches: '/logout' } },
          { not: { href_matches: '/admin/*' } },
          { not: { href_matches: '/*\\?*token=*' } },
          { not: { href_matches: '/*\\?*add-to-cart=*' } },
          { not: { selector_matches: '[rel~=nofollow]' } },
          { not: { selector_matches: '.no-speculation' } },
          { not: { selector_matches: '[download]' } },
        ],
      },
    } as any,
  ],
};

export const spaLikeConfig: ApplicationConfig = {
  providers: [
    provideSpeculationRules({
      enabled: true,
      autoInsert: true,
      defaultRules: aggressivePrefetchRules,
    }),
  ],
};

// ============================================================================
// EXAMPLE 5: TWA-Specific Configuration (Mobile Optimized)
// ============================================================================
const twaSpeculationRules: SpeculationRules = {
  // Conservative prefetch for mobile to save data
  prefetch: [
    {
      source: 'document',
      eagerness: 'conservative', // Only prefetch on strong user intent
      where: {
        and: [
          { href_matches: '/*' },
          // Only prefetch high-priority navigation
          { selector_matches: 'nav a, .primary-navigation a' },
          { not: { href_matches: '/logout' } },
        ],
      },
    } as any,
  ],
};

export const twaConfig: ApplicationConfig = {
  providers: [
    provideSpeculationRules({
      enabled: true,
      autoInsert: true,
      defaultRules: twaSpeculationRules,
      debug: false,
    }),
  ],
};

// ============================================================================
// EXAMPLE 6: Contextual Configuration (Adapts to Device)
// ============================================================================
// This would be used with the ContextService to adapt behavior
export const adaptiveConfig: ApplicationConfig = {
  providers: [
    // Base configuration without auto-insert
    // The application will dynamically insert rules based on device type
    provideSpeculationRules({
      enabled: true,
      autoInsert: false,
      debug: isDevMode(),
    }),
  ],
};

// ============================================================================
// EXAMPLE 7: Production-Ready Configuration with All Safeguards
// ============================================================================
const productionSpeculationRules: SpeculationRules = {
  prefetch: [
    {
      source: 'document',
      eagerness: 'moderate',
      referrer_policy: 'strict-origin-when-cross-origin',
      where: {
        and: [
          // Only same-origin links
          { href_matches: '/*' },
          
          // Exclude authentication & sensitive routes
          { not: { href_matches: '/logout' } },
          { not: { href_matches: '/login' } },
          { not: { href_matches: '/auth/*' } },
          { not: { href_matches: '/admin/*' } },
          { not: { href_matches: '/api/*' } },
          
          // Exclude state-changing operations
          { not: { href_matches: '/*\\?*add-to-cart=*' } },
          { not: { href_matches: '/*\\?*remove-from-cart=*' } },
          { not: { href_matches: '/*\\?*checkout*' } },
          
          // Exclude external and nofollow links
          { not: { selector_matches: '[rel~=nofollow]' } },
          { not: { selector_matches: '[rel~=external]' } },
          { not: { selector_matches: '[target=_blank]' } },
          
          // Exclude custom markers
          { not: { selector_matches: '.no-speculation' } },
          { not: { selector_matches: '[data-no-prefetch]' } },
          
          // Exclude downloads
          { not: { selector_matches: '[download]' } },
        ],
      },
    } as any,
  ],
};

export const productionConfig: ApplicationConfig = {
  providers: [
    provideSpeculationRules({
      enabled: !isDevMode(),
      autoInsert: true,
      defaultRules: productionSpeculationRules,
      debug: false,
    }),
  ],
};

// ============================================================================
// USAGE IN APP CONFIG
// ============================================================================
/**
 * To use any of these configurations, import and merge with your app config:
 * 
 * ```typescript
 * import { mergeApplicationConfig } from '@angular/core';
 * import { appConfig } from './app.config';
 * import { productionConfig } from './examples/speculation-rules.examples';
 * 
 * export const config = mergeApplicationConfig(appConfig, productionConfig);
 * ```
 */
