import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-about',
  template: `
    <div class="max-w-4xl mx-auto p-8">
      <h1 class="text-4xl font-bold text-gray-800 mb-8">
        About Speculation Rules
      </h1>

      <section class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2
          class="text-2xl font-semibold text-gray-700 mb-4 border-b-2 border-blue-500 pb-2"
        >
          What are Speculation Rules?
        </h2>
        <p class="text-gray-600 leading-relaxed mb-4">
          The Speculation Rules API is a powerful browser feature that allows
          developers to hint to the browser which navigations are likely to
          happen next. This enables the browser to prefetch or even prerender
          those pages ahead of time.
        </p>
        <p class="text-gray-600 leading-relaxed">
          By using speculation rules, you can significantly improve the
          perceived performance of your web application, making page transitions
          feel nearly instant.
        </p>
      </section>

      <section class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2
          class="text-2xl font-semibold text-gray-700 mb-4 border-b-2 border-blue-500 pb-2"
        >
          Key Benefits
        </h2>
        <ul class="space-y-3">
          <li class="flex items-start">
            <span class="text-blue-500 mr-2">✓</span>
            <span class="text-gray-600"
              >Instant page navigations with prerendering</span
            >
          </li>
          <li class="flex items-start">
            <span class="text-blue-500 mr-2">✓</span>
            <span class="text-gray-600"
              >Reduced latency with smart prefetching</span
            >
          </li>
          <li class="flex items-start">
            <span class="text-blue-500 mr-2">✓</span>
            <span class="text-gray-600"
              >Configurable eagerness levels for resource optimization</span
            >
          </li>
          <li class="flex items-start">
            <span class="text-blue-500 mr-2">✓</span>
            <span class="text-gray-600"
              >Document and list-based rule sources</span
            >
          </li>
        </ul>
      </section>

      <section
        class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white"
      >
        <h2 class="text-2xl font-semibold mb-4">Get Started</h2>
        <p class="leading-relaxed opacity-90">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris.
        </p>
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AboutComponent {
  constructor() {
    console.log('AboutComponent: Constructor executed');
  }
}
