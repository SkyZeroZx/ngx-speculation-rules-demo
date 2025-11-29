import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-company',
  template: `
    <div class="max-w-5xl mx-auto p-8">
      <section class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2
          class="text-2xl font-semibold text-gray-700 mb-4 border-b-2 border-blue-500 pb-2"
        >
          About ngx-speculation-rules
        </h2>

        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Capybara_%28Hydrochoerus_hydrochaeris%29.JPG/1280px-Capybara_%28Hydrochoerus_hydrochaeris%29.JPG" 
          alt="Capybara" 
          class="w-full max-w-md mx-auto rounded-lg shadow-md mb-6"
        />

        <p class="text-gray-600 leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
          consectetur libero id magna vestibulum, vel hendrerit nisi tincidunt.
          Praesent euismod, nisl eget ultricies tincidunt, nisl nisl aliquam
          nisl.
        </p>
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CompanyComponent {
  constructor() {
    console.log('CompanyComponent: Constructor executed');
  }
}
