import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NotificationService,
  NotificationMessage,
} from '../../services/notification/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      <div
        *ngFor="let notification of notificationService.getNotifications()"
        [ngClass]="getNotificationClass(notification.type)"
        class="notification"
      >
        <span class="notification-message">{{ notification.message }}</span>
        <button
          (click)="dismiss(notification)"
          class="notification-close"
          aria-label="Cerrar notificación"
        >
          ✕
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        max-width: 400px;
      }

      .notification {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        margin-bottom: 8px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        animation: slideIn 0.3s ease-out;
      }

      .notification-success {
        background-color: #d4edda;
        color: #155724;
        border-left: 4px solid #28a745;
      }

      .notification-error {
        background-color: #f8d7da;
        color: #721c24;
        border-left: 4px solid #dc3545;
      }

      .notification-warning {
        background-color: #fff3cd;
        color: #856404;
        border-left: 4px solid #ffc107;
      }

      .notification-info {
        background-color: #d1ecf1;
        color: #0c5460;
        border-left: 4px solid #17a2b8;
      }

      .notification-message {
        flex-grow: 1;
        font-weight: 500;
      }

      .notification-close {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        margin-left: 12px;
        opacity: 0.7;
        transition: opacity 0.2s;
      }

      .notification-close:hover {
        opacity: 1;
      }

      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `,
  ],
})
export class NotificationComponent {
  constructor(public notificationService: NotificationService) {}

  getNotificationClass(type: string): string {
    return `notification-${type}`;
  }

  dismiss(notification: NotificationMessage) {
    this.notificationService.removeNotification(notification);
  }
}
