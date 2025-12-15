import { Injectable } from '@angular/core';

export interface NotificationMessage {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notifications: NotificationMessage[] = [];

  constructor() {}

  showSuccess(message: string, duration: number = 3000) {
    this.showNotification({
      message,
      type: 'success',
      duration,
    });
  }

  showError(message: string, duration: number = 5000) {
    this.showNotification({
      message,
      type: 'error',
      duration,
    });
  }

  showWarning(message: string, duration: number = 4000) {
    this.showNotification({
      message,
      type: 'warning',
      duration,
    });
  }

  showInfo(message: string, duration: number = 3000) {
    this.showNotification({
      message,
      type: 'info',
      duration,
    });
  }

  private showNotification(notification: NotificationMessage) {
    this.notifications.push(notification);

    // Auto-remove notification after duration
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        this.removeNotification(notification);
      }, notification.duration);
    }
  }

  removeNotification(notification: NotificationMessage) {
    const index = this.notifications.indexOf(notification);
    if (index > -1) {
      this.notifications.splice(index, 1);
    }
  }

  getNotifications(): NotificationMessage[] {
    return this.notifications;
  }

  clearAll() {
    this.notifications = [];
  }
}
