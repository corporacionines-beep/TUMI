import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();
  private nextId = 1;

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') {
    const notification: Notification = {
      id: this.nextId++,
      message,
      type
    };

    const notifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...notifications, notification]);

    // Auto-remove después de 3 segundos
    setTimeout(() => {
      this.remove(notification.id);
    }, 3000);
  }

  remove(id: number) {
    const notifications = this.notificationsSubject.value.filter(n => n.id !== id);
    this.notificationsSubject.next(notifications);
  }

  success(message: string) {
    this.show(message, 'success');
  }

  error(message: string) {
    this.show(message, 'error');
  }

  info(message: string) {
    this.show(message, 'info');
  }

  warning(message: string) {
    this.show(message, 'warning');
  }
}