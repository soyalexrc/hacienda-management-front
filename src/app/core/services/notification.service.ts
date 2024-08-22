import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {BehaviorSubject, Observable} from "rxjs";
import {NotesInfo, NotificationActionResult, NotificationsResult} from "../interfaces/notification";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  notifications: BehaviorSubject<NotesInfo[]> = new BehaviorSubject<NotesInfo[]>(JSON.parse(sessionStorage.getItem('notifications') || '[]'));
  baseUrl = environment.baseUrl;

  getNotifications(assetId = 0): void{
    this.http.get<NotificationsResult>(`${this.baseUrl}/Users/GetNotes?assetid=${assetId}`).subscribe(result => {
      sessionStorage.setItem('notifications', JSON.stringify(result.notesInfo));
      this.notifications.next(result.notesInfo);
    })
  }

  manageNotificationActions(noteId: number, actionType: 'READ' | 'DELETE' | 'UNREAD'): Observable<NotificationActionResult> {
    return this.http.post<NotificationActionResult>(`${this.baseUrl}/Users/readDeleteNote?NoteId=${noteId}&action=${actionType}`, {})
  }

  get getCurrentNotifications() {
    return this.notifications.value;
  }
}
