export type DiscussionAuthorRole = "ADMIN" | "INSTRUCTOR" | "STUDENT" | "SUPER_ADMIN";

export interface DiscussionAuthor {
  _id: string;
  name: string;
  profilePicture: string | null;
  role: DiscussionAuthorRole;
}

export interface DiscussionQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  searchTerm?: string;
  courseId?: string;
}

export interface DiscussionPagination {
  total: number;
  limit: number;
  page: number;
  totalPage: number;
}

export interface DiscussionPost {
  _id: string;
  author: DiscussionAuthor;
  title: string;
  course: string;
  content: string;
  image: string | null;
  likesCount: number;
  repliesCount: number;
  isLiked: boolean;
  createdAt: string;
}

export interface DiscussionReplyChild {
  _id: string;
  author: DiscussionAuthor;
  content: string;
  parentReply?: string | null;
  createdAt: string;
}

export interface DiscussionReply {
  _id: string;
  author: DiscussionAuthor;
  content: string;
  children: DiscussionReplyChild[];
  createdAt: string;
}

export interface DiscussionPostDetail extends DiscussionPost {
  replies: DiscussionReply[];
  hasMoreReplies: boolean;
}

export interface DiscussionPostsResponse {
  success: boolean;
  message?: string;
  pagination: DiscussionPagination;
  data: DiscussionPost[];
}

export interface DiscussionPostDetailResponse {
  success: boolean;
  message?: string;
  data: DiscussionPostDetail;
}

export interface DiscussionReplyPayload {
  postId: string;
  content: string;
  parentReplyId?: string;
}

export interface DiscussionReplyCreated {
  _id: string;
  content: string;
  parentReply: string | null;
  createdAt: string;
}

export interface DiscussionReplyResponse {
  success: boolean;
  message?: string;
  data: DiscussionReplyCreated;
}

export interface DiscussionReplyUpdatePayload {
  replyId: string;
  postId: string;
  content: string;
}

export interface DiscussionReplyUpdated {
  _id: string;
  content: string;
}

export interface DiscussionReplyUpdateResponse {
  success: boolean;
  message?: string;
  data: DiscussionReplyUpdated;
}

export interface DiscussionDeleteResponse {
  success: boolean;
  message: string;
}

export interface DiscussionCourseOption {
  _id: string;
  title: string;
}

export interface DiscussionCourseOptionsResponse {
  success: boolean;
  message?: string;
  data: DiscussionCourseOption[];
}
