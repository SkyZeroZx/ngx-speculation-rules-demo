# Speculation Rules API Service

A comprehensive Angular service wrapper for the [Speculation Rules API](https://developer.mozilla.org/en-US/docs/Web/API/Speculation_Rules_API)

## 📦 Installation

The service is already integrated into the project. No additional dependencies required.

## 🚀 Quick Start

### Basic Setup

Add to your `app.config.ts`:

```ts
import { ApplicationConfig } from "@angular/core";
import { provideSpeculationRules } from "@/services/speculation-rules";

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    provideSpeculationRules({
      enabled: true,
      autoInsert: false,
      debug: false,
    }),
  ],
};
```

### Auto-Prefetch All Links

```ts
import { provideSpeculationRulesWithPrefetch } from "@/services/speculation-rules";

export const appConfig: ApplicationConfig = {
  providers: [
    // Automatically prefetch all internal links with moderate eagerness
    provideSpeculationRulesWithPrefetch("moderate"),
  ],
};
```

### Component Usage

```ts
import { Component, inject, OnInit } from "@angular/core";
import { SpeculationRulesService } from "@/services/speculation-rules";

@Component({
  selector: "app-product-list",
  template: `
    @if (speculationService.isSupported().supported) {
    <p>✅ Speculation Rules supported!</p>
    }
  `,
})
export class ProductListComponent implements OnInit {
  private readonly speculationService = inject(SpeculationRulesService);

  ngOnInit() {
    // Prefetch next page
    this.speculationService.prefetchUrls(["/products/next-page"]);

    // Prerender product detail pages
    const topProductUrls = ["/products/1", "/products/2", "/products/3"];
    this.speculationService.prerenderUrls(topProductUrls);

    // Add document rules for all product links
    this.speculationService.addDocumentRules("prefetch", 'a[href^="/products/"]');
  }
}
```

## 📚 API Reference

### Service Methods

#### `insertRules(rules: SpeculationRules, id?: string): string | null`

Insert custom speculation rules into the document.

```ts
const ruleId = speculationService.insertRules(
  {
    prefetch: [
      {
        source: "list",
        urls: ["/page1", "/page2"],
        eagerness: "eager",
        referrer_policy: "no-referrer",
      },
    ],
  },
  "my-custom-rules"
);
```

#### `removeRules(id: string): boolean`

Remove previously inserted rules by ID.

```typescript
speculationService.removeRules("my-custom-rules");
```

#### `clearAllRules(): void`

Remove all speculation rules from the document.

```typescript
speculationService.clearAllRules();
```

#### `prefetchUrls(urls: string[], options?): string | null`

Prefetch a list of URLs.

```typescript
speculationService.prefetchUrls(["/about", "/contact"]);
```

#### `prerenderUrls(urls: string[], options?): string | null`

Prerender a list of URLs (use sparingly - resource intensive).

```typescript
speculationService.prerenderUrls(["/dashboard"]);
```

#### `addDocumentRules(action, selector?, options?): string | null`

Add document-based rules with CSS selector matching.

```typescript
// Prefetch all internal links
speculationService.addDocumentRules("prefetch", "a[href]");

// Prerender specific links
speculationService.addDocumentRules("prerender", "a.prerender-link");
```

#### `isSupported: SpeculationSupport`

Check browser support for Speculation Rules API.

```ts
const support = speculationService.isSupported();
console.log(support.supported); // true/false
console.log(support.prefetchSupported); // true/false
console.log(support.prerenderSupported); // true/false
```

#### `isPrerendering: boolean`

Check if the current page is being prerendered.

```ts
if (speculationService.isPrerendering) {
  console.log("Page is being prerendered");
  // Defer analytics or other side effects
}
```

## ⚙️ Configuration Options

### Provider Configuration

```ts
interface SpeculationRulesServiceConfig {
  /** Enable/disable the service globally */
  enabled?: boolean;

  /** Auto-insert rules on service initialization */
  autoInsert?: boolean;

  /** Default rules to apply */
  defaultRules?: SpeculationRules;

  /** Enable debug logging */
  debug?: boolean;
}
```

### Speculation Rules Schema

```ts
interface SpeculationRules {
  prefetch?: SpeculationRule[];
  prerender?: SpeculationRule[];
  prefetch_with_subresources?: SpeculationRule[];
}

// List-based rules
interface SpeculationListRule {
  source: "list";
  urls: string[];
  eagerness?: "immediate" | "eager" | "moderate" | "conservative";
  referrer_policy?: ReferrerPolicy;
  requires?: ["anonymous-client-ip-when-cross-origin"];
}

// Document-based rules
interface SpeculationDocumentRule {
  source: "document";
  where?: SpeculationCondition;
  eagerness?: "immediate" | "eager" | "moderate" | "conservative";
}
```

## 🎨 Usage Examples

### E-commerce Product Navigation

```typescript
@Component({
  selector: "app-shop",
})
export class ShopComponent implements OnInit {
  private readonly speculation = inject(SpeculationRulesService);

  ngOnInit() {
    // Prefetch product detail pages when hovering over products
    this.speculation.insertRules({
      prefetch: [
        {
          source: "document",
          where: {
            and: [{ href_matches: "/products/*" }, { selector_matches: ".product-card a" }],
          },
          eagerness: "moderate",
        },
      ],
    });
  }
}
```

### Blog with Smart Prerendering

```typescript
@Component({
  selector: "app-blog",
})
export class BlogComponent implements AfterViewInit {
  private readonly speculation = inject(SpeculationRulesService);

  ngAfterViewInit() {
    // Prerender only the top 3 featured articles
    const featuredArticles = this.getFeaturedArticleUrls();
    this.speculation.prerenderUrls(featuredArticles.slice(0, 3));

    // Prefetch all other articles
    this.speculation.addDocumentRules("prefetch", "a.article-link");
  }
}
```

### Conditional Speculation Based on Context

```typescript
@Component({
  selector: "app-adaptive-navigation",
})
export class AdaptiveNavigationComponent implements OnInit {
  private readonly speculation = inject(SpeculationRulesService);
  private readonly context = inject(ContextService);

  ngOnInit() {
    // Only enable aggressive prefetching on desktop
    if (this.context.isDesktop()) {
      this.speculation.insertRules({
        prefetch: [
          {
            source: "document",
            eagerness: "eager",
            where: {
              and: [{ href_matches: "/*" }, { not: { selector_matches: "[rel~=nofollow]" } }],
            },
          },
        ],
      });
    } else if (this.context.isMobile()) {
      // Conservative prefetching on mobile
      this.speculation.insertRules({
        prefetch: [
          {
            source: "document",
            eagerness: "conservative",
            where: {
              selector_matches: "a.important-link",
            },
          },
        ],
      });
    }
  }
}
```

### Handle Prerendering State

```typescript
@Component({
  selector: "app-analytics",
})
export class AnalyticsComponent implements OnInit {
  private readonly speculation = inject(SpeculationRulesService);
  private readonly document = inject(DOCUMENT);

  ngOnInit() {
    if (this.speculation.isPrerendering()) {
      // Defer analytics until page is actually viewed
      this.document.addEventListener(
        "prerenderingchange",
        () => {
          this.initAnalytics();
        },
        { once: true }
      );
    } else {
      this.initAnalytics();
    }
  }

  private initAnalytics() {
    // Send analytics data
  }
}
```

## 📖 Further Reading

- [MDN Speculation Rules API](https://developer.mozilla.org/en-US/docs/Web/API/Speculation_Rules_API)
- [Chrome Prerender Pages Guide](https://developer.chrome.com/docs/web-platform/prerender-pages)
- [Web.dev Speculation Rules](https://web.dev/articles/speculation-rules)
