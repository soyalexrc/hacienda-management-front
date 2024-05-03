import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {NotesInfo} from "../../core/interfaces/notification";
import {NotificationService} from "../../core/services/notification.service";
import {DatePipe} from "@angular/common";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    DatePipe
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: NotesInfo[] = [];
  notificationsSubscription = new Subscription();
  private readonly notificationsService = inject(NotificationService)

  ngOnInit() {
    this.notificationsSubscription = this.notificationsService.notifications.subscribe(result => {
      this.notifications = result;
    })
  }

  ngOnDestroy() {
    this.notificationsSubscription.unsubscribe();
  }
}
