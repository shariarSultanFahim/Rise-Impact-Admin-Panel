export interface DiscussionsHeading {
  title: string;
  subtitle: string;
}

export interface DiscussionMessage {
  id: string;
  author: string;
  role: "Student" | "Instructor";
  time: string;
  content: string;
}

export interface DiscussionThreadItem {
  id: string;
  title: string;
  author: string;
  course: string;
  replies: number;
  lastActive: string;
  isPinned: boolean;
  messages: DiscussionMessage[];
}

export interface DiscussionsPagination {
  page: number;
  totalPages: number;
  showing: number;
  total: number;
}

export interface DiscussionsData {
  heading: DiscussionsHeading;
  threads: DiscussionThreadItem[];
  pagination: DiscussionsPagination;
}
