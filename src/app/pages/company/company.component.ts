import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-company',
  template: `
    <div class="max-w-5xl mx-auto p-8">
      <section class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2
          class="text-2xl font-semibold text-gray-700 mb-4 border-b-2 border-blue-500 pb-2"
        >
          About Capybara
        </h2>

        <img 
          src="https://www.infobae.com/resizer/v2/4U2KUGDQCZFZZO5PTG4DOG6EEU.png?auth=f2ac2eb73f7a7a50c8509b69329f891d9d0c42f47d5bb0867228909ed65525f0&smart=true&width=992&height=1002&quality=85" 
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
