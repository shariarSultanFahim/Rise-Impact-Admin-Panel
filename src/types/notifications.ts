export interface NotificationsHeading {
  title: string;
  subtitle: string;
}

export interface NotificationTemplate {
  id: string;
  title: string;
  description: string;
  message: string;
}

export interface NotificationAudience {
  id: string;
  title: string;
  description: string;
}

export interface NotificationsData {
  heading: NotificationsHeading;
  templates: NotificationTemplate[];
  audiences: NotificationAudience[];
}
