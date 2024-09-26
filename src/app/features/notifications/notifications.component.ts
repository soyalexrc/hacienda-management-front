import {Component, inject, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NotesInfo} from "../../core/interfaces/notification";
import {NotificationService} from "../../core/services/notification.service";
import {DatePipe, NgClass, NgStyle} from "@angular/common";
import {Subscription} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ReactiveFormsModule} from "@angular/forms";
import {ToastService} from "../../core/services/toast.service";
import {NgIcon, provideIcons} from "@ng-icons/core";
import {heroTrashSolid} from "@ng-icons/heroicons/solid";
import {AuthService} from "../../core/services/auth.service";

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    NgIcon,
    NgClass,
    NgStyle
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
  viewProviders: [provideIcons({ heroTrashSolid })]

})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: NotesInfo[] = [];
  notificationsSubscription = new Subscription();
  private readonly notificationsService = inject(NotificationService)
  private modalService = inject(NgbModal);
  private auth = inject(AuthService);
  currentNotification!: NotesInfo;
  @ViewChild('successToast') successToast! : TemplateRef<any>;
  @ViewChild('dangerToast') dangerToast! : TemplateRef<any>;
  private toastService = inject(ToastService);
  @ViewChild('notificationDetailModal') notificationDetailModal = TemplateRef<any>;

  ngOnInit() {
    this.notificationsSubscription = this.notificationsService.notifications.subscribe(result => {
      this.notifications = result;
    })
  }

  openNote(notification: NotesInfo){
    if (!notification.notereaddate) {
      this.notificationsService.manageNotificationActions(notification.noteid, 'READ').subscribe(res => {
        if (!res.hasError) {
          this.currentNotification = notification;
          this.modalService.open(this.notificationDetailModal);
          this.notificationsService.getNotifications();
        }
      })
    } else {
      this.currentNotification = notification;
      this.modalService.open(this.notificationDetailModal);
    }
  }

  deleteNode(noteId: number) {
    this.notificationsService.manageNotificationActions(noteId, 'DELETE').subscribe(res => {
      if (!res.hasError) {
        this.toastService.show({template: this.successToast, classname: 'bg-success text-light', delay: 10000})
        this.notificationsService.getNotifications();
        this.modalService.dismissAll();
      }
    })
  }

  ngOnDestroy() {
    this.notificationsSubscription.unsubscribe();
  }
}
