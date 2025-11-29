import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-content-desktop',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './content-desktop.component.html',
  styleUrl: './content-desktop.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ContentDesktopComponent {
  constructor() {
    console.log('ContentDesktopComponent: Constructor executed');
  }
}
