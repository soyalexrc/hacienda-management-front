import {Component, inject} from '@angular/core';
import {ToastService} from "../../../core/services/toast.service";
import {NgbToast} from "@ng-bootstrap/ng-bootstrap";
import {NgTemplateOutlet} from "@angular/common";

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [
    NgbToast,
    NgTemplateOutlet
  ],
  templateUrl: './toast-container.component.html',
  host: { class: 'toast-container position-fixed top-0 end-0 p-3', style: 'z-index: 1200' },
})
export class ToastContainerComponent {
  public toastService = inject(ToastService)
}
