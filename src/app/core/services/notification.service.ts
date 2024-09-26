import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {BehaviorSubject, interval, Observable} from "rxjs";
import {NotesInfo, NotificationActionResult, NotificationsResult} from "../interfaces/notification";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  notifications: BehaviorSubject<NotesInfo[]> = new BehaviorSubject<NotesInfo[]>(JSON.parse(sessionStorage.getItem('notifications') || '[]'));
  baseUrl = environment.baseUrl;
  private auth = inject(AuthService);

  getNotifications(): void{
    const assetId = this.auth.getCurrentUser.mainUser.assetID
    this.http.get<NotificationsResult>(`${this.baseUrl}/Users/GetNotes?assetid=${assetId}`).subscribe(result => {
      sessionStorage.setItem('notifications', JSON.stringify(result.notesInfo));
      this.notifications.next(result.notesInfo);
    })
  }

  startNotificationsFetchLoop() {
    interval(120000) // 2 minutes in milliseconds
      .subscribe(() => {
        this.getNotifications();
      });
  }

  manageNotificationActions(noteId: number, actionType: 'READ' | 'DELETE' | 'UNREAD'): Observable<NotificationActionResult> {
    return this.http.post<NotificationActionResult>(`${this.baseUrl}/Users/readDeleteNote?NoteId=${noteId}&action=${actionType}`, {})
  }

  get getCurrentNotifications() {
    return this.notifications.value;
  }
}
