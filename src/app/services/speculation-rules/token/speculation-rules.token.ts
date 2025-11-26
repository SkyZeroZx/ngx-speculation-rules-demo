import { InjectionToken } from '@angular/core';
import {
  SpeculationRules,
  SpeculationRulesServiceConfig,
  SpeculationSupport,
} from '../interfaces';

/**
 * Abstract service for managing Speculation Rules API
 * Provides platform-agnostic interface for prefetching and prerendering
 */
export abstract class SpeculationRulesService {
  /**
   * Check if Speculation Rules API is supported
   */
  abstract readonly isSupported: SpeculationSupport;

  /**
   * Check if the document is currently prerendering
   */
  abstract readonly isPrerendering: boolean;

  /**
   * Insert speculation rules into the document
   * @param rules - The speculation rules to insert
   * @param id - Optional ID for the script element (for later removal)
   * @returns The created script element ID or null if not supported
   */
  abstract insertRules(rules: SpeculationRules, id?: string): string | null;

  /**
   * Remove previously inserted speculation rules
   * @param id - The ID of the script element to remove
   * @returns True if the rules were removed, false otherwise
   */
  abstract removeRules(id: string): boolean;

  /**
   * Remove all speculation rules from the document
   */
  abstract clearAllRules(): void;

  /**
   * Prefetch a list of URLs
   * @param urls - Array of URLs to prefetch
   * @param options - Optional configuration for prefetch rules
   */
  abstract prefetchUrls(
    urls: string[],
    options?: Partial<SpeculationRulesServiceConfig>
  ): string | null;

  /**
   * Prerender a list of URLs
   * @param urls - Array of URLs to prerender
   * @param options - Optional configuration for prerender rules
   */
  abstract prerenderUrls(
    urls: string[],
    options?: Partial<SpeculationRulesServiceConfig>
  ): string | null;

  /**
   * Add document-based speculation rules with CSS selector matching
   * @param action - 'prefetch' or 'prerender'
   * @param selector - CSS selector to match links
   * @param options - Optional configuration
   */
  abstract addDocumentRules(
    action: 'prefetch' | 'prerender',
    selector?: string,
    options?: Partial<SpeculationRulesServiceConfig>
  ): string | null;
}

/**
 * Injection token for Speculation Rules Service configuration
 */
export const SPECULATION_RULES_CONFIG =
  new InjectionToken<SpeculationRulesServiceConfig>(
    'SPECULATION_RULES_CONFIG',
    {
      factory: () => ({
        enabled: true,
        autoInsert: false,
      }),
    }
  );
