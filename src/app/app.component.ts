import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ViewerComponent } from './viewer/viewer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ViewerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'xeokit-poc';
}
