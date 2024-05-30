import {Injectable, TemplateRef, ViewChild, ViewRef} from '@angular/core';

export interface Toast {
  template: TemplateRef<any>;
  classname?: string;
  delay?: number;
}


@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts: Toast[] = [];
  @ViewChild('standardToast') standardToast = TemplateRef<any>

  show(toast: Toast) {
    this.toasts.push(toast);
  }

  remove(toast: Toast) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

  clear() {
    this.toasts.splice(0, this.toasts.length);
  }
}
