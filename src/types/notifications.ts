// Legacy types (for mock data compatibility)
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

// API Request/Response Types (15.1 Send Notification)
export interface SendNotificationPayload {
  title: string;
  text: string;
  audience: "all" | "course";
  courseId?: string;
}

export interface SendNotificationResponse {
  success: boolean;
  message: string;
  data: {
    recipientCount: number;
  };
}

// API Response Types (15.2 Sent History)
export interface SentNotificationItem {
  _id: string;
  title: string;
  text: string;
  audience: "all" | "course";
  courseTitle?: string;
  recipientCount: number;
  createdAt: string;
}

export interface NotificationPagination {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface SentNotificationHistoryResponse {
  success: boolean;
  message: string;
  pagination: NotificationPagination;
  data: SentNotificationItem[];
}

// Query Parameters
export interface NotificationQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  searchTerm?: string;
  audience?: "all" | "course";
}
