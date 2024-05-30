export interface NotificationsResult {
  notesInfo:    NotesInfo[];
  hasError:     boolean;
  errorDisplay: string;
  errorDesc:    string;
  errorNum:     number;
  errorSubject: string;
  message:      string;
}

export interface NotesInfo {
  noteid:          number;
  noteassetid:     number;
  notetxt:         string;
  notesubject:     string;
  notefrom:        string;
  notedate:        string;
  notereaddate:    string;
  notestatus:      boolean;
  notedeleteddate: string;
}

export interface NotificationActionResult {
  hasError: boolean;
  errorDisplay: string;
  errorDesc: string;
  errorNum: number;
  errorSubject: string;
  message: string;
}
