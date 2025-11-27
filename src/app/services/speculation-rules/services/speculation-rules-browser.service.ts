import {
  DOCUMENT,
  inject,
  Injectable,
  isDevMode,
  PLATFORM_ID,
} from '@angular/core';

import {
  SpeculationRules,
  SpeculationRulesServiceConfig,
  SpeculationSupport,
} from '../interfaces';
import { SPECULATION_RULES_CONFIG, SpeculationRulesService } from '../token';
import { isPlatformBrowser } from '@angular/common';

declare global {
  interface Document {
    // Indicates if the document is currently prerendering
    // See https://developer.mozilla.org/en-US/docs/Web/API/Document/prerendering
    prerendering: boolean;
  }
}

@Injectable({
  providedIn: 'root',
})
export class SpeculationRulesBrowserService implements SpeculationRulesService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  protected readonly config = inject(SPECULATION_RULES_CONFIG);

  // Track inserted script elements by ID
  private readonly scriptElements = new Map<string, HTMLScriptElement>();
  private scriptIdCounter = 0;

  /**
   * Check browser support for Speculation Rules API
   */
  readonly isSupported = this.checkSupport();

  /**
   * Track if document is currently prerendering
   */
  readonly isPrerendering = this.document.prerendering;

  constructor() {
    this.init();
  }

  private init() {
    if (this.config.autoInsert && this.config.defaultRules) {
      this.insertRules(this.config.defaultRules, 'default-rules');
    }
  }

  /**
   * Insert speculation rules into the document
   */
  insertRules(rules: SpeculationRules, id?: string): string | null {
    if (!this.isSupported.supported) {
      isDevMode() &&
        this.isBrowser &&
        console.warn('Speculation Rules API not supported in this browser.');
      return null;
    }

    const scriptId = id || `speculation-rules-${this.scriptIdCounter++}`;

    // Remove existing script with same ID if exists
    if (this.scriptElements.has(scriptId)) {
      this.removeRules(scriptId);
    }

    const script = this.document.createElement('script');
    script.type = 'speculationrules';
    script.id = scriptId;
    script.textContent = JSON.stringify(rules, null, 2);

    this.document.body.appendChild(script);
    this.scriptElements.set(scriptId, script);

    return scriptId;
  }

  /**
   * Remove speculation rules by ID
   */
  removeRules(id: string): boolean {
    const script = this.scriptElements.get(id);
    if (!script) {
      return false;
    }

    script.remove();
    this.scriptElements.delete(id);
    return true;
  }

  /**
   * Remove all speculation rules
   */
  clearAllRules(): void {
    const scripts = this.scriptElements.keys();
    for (const id of scripts) {
      this.removeRules(id);
    }
  }

  /**
   * Prefetch URLs
   */
  prefetchUrls(
    urls: string[],
    options?: Partial<SpeculationRulesServiceConfig>
  ): string | null {
    const baseRule = options?.defaultRules?.prefetch?.[0] || {};
    const rules: SpeculationRules = {
      prefetch: [
        {
          ...baseRule,
          source: 'list',
          urls,
        },
      ],
    };

    return this.insertRules(rules);
  }

  /**
   * Prerender URLs
   */
  prerenderUrls(
    urls: string[],
    options?: Partial<SpeculationRulesServiceConfig>
  ): string | null {
    const baseRule = options?.defaultRules?.prerender?.[0] || {};
    const rules: SpeculationRules = {
      prerender: [
        {
          ...baseRule,
          source: 'list',
          urls,
        },
      ],
    };

    return this.insertRules(rules);
  }

  /**
   * Add document-based speculation rules
   */
  addDocumentRules(
    action: 'prefetch' | 'prerender',
    selector = 'a[href]',
    options?: Partial<SpeculationRulesServiceConfig>
  ): string | null {
    const baseRule = options?.defaultRules?.[action]?.[0] || {};
    const rules: SpeculationRules = {
      [action]: [
        {
          ...baseRule,
          source: 'document',
          where: {
            and: [
              { href_matches: '/*' },
              { selector_matches: selector },
              // Exclude common patterns that should not be speculated
              { not: { href_matches: '/logout' } },
              { not: { href_matches: '/*\\?*logout*' } },
              { not: { selector_matches: '[rel~=nofollow]' } },
              { not: { selector_matches: '.no-speculation' } },
            ],
          },
        },
      ],
    };

    return this.insertRules(rules, `document-${action}`);
  }

  /**
   * Check if Speculation Rules API is supported
   */
  private checkSupport(): SpeculationSupport {
    if (
      typeof HTMLScriptElement === 'undefined' ||
      !HTMLScriptElement.supports
    ) {
      return {
        supported: false,
        prefetchSupported: false,
        prerenderSupported: false,
      };
    }

    const supported = HTMLScriptElement.supports('speculationrules');

    return {
      supported,
      prefetchSupported: supported,
      prerenderSupported: supported,
    };
  }
}
