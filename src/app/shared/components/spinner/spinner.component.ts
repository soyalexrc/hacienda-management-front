import {Component, Input} from '@angular/core';
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [
    NgStyle
  ],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent {
  @Input({required: true}) isLoading!: boolean;
  @Input() color = '#0d6efd';
  @Input() message?: string;
  @Input() width = 25;
  @Input() borderWidth = 2;
  @Input() height = 25;

  get getWidth() {
    return this.width + 'px'
  }
  get getHeight() {
    return this.height + 'px'
  }
}
