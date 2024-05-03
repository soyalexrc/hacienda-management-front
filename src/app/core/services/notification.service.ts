import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {BehaviorSubject, Observable} from "rxjs";
import {NotesInfo, NotificationsResult} from "../interfaces/notification";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  notifications: BehaviorSubject<NotesInfo[]> = new BehaviorSubject<NotesInfo[]>([]);
  baseUrl = environment.baseUrl;
  getNotifications(): void{
    this.http.get<NotificationsResult>(`${this.baseUrl}/Users/GetNotes`).subscribe(result => {
      this.notifications.next(result.notesInfo);
    })
  }

  get getCurrentNotifications() {
    return this.notifications.value;
  }
}
