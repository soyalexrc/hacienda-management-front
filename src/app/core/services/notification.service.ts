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
  notifications: BehaviorSubject<NotesInfo[]> = new BehaviorSubject<NotesInfo[]>([]);
  baseUrl = environment.baseUrl;
  getNotifications(): void{
    this.http.get<NotificationsResult>(`${this.baseUrl}/Users/GetNotes`).subscribe(result => {
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
