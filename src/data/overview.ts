import type { OverviewData } from "@/types/overview";

const overviewData: OverviewData = {
  heading: {
    title: "Welcome, Instructor Sadat",
    subtitle: "Here's what's happening with your courses today"
  },
  stats: [
    {
      id: "total-students",
      title: "Total Students",
      value: "248",
      delta: "+12.5%",
      deltaLabel: "vs last month",
      icon: "students"
    },
    {
      id: "active-courses",
      title: "Active Courses",
      value: "12",
      delta: "+2",
      deltaLabel: "this month",
      icon: "courses"
    },
    {
      id: "avg-completion",
      title: "Avg Completion",
      value: "78%",
      delta: "+5.2%",
      deltaLabel: "vs last month",
      icon: "completion"
    },
    {
      id: "pending-approvals",
      title: "Pending Approvals",
      value: "7",
      delta: "",
      deltaLabel: "",
      icon: "approvals"
    }
  ],
  chart: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    values: [62, 71, 66, 78, 82, 86]
  },
  activities: [
    {
      id: "activity-1",
      title: "New Student Registered",
      description: "Sarah Johnson completed registration",
      time: "5 minutes ago",
      icon: "activity-student"
    },
    {
      id: "activity-2",
      title: "Quiz Submitted",
      description: "Michael Chen submitted \"Life Skills Assessment Quiz\"",
      time: "12 minutes ago",
      icon: "activity-quiz"
    },
    {
      id: "activity-3",
      title: "New Feedback",
      description: "Emma Davis left feedback on \"Communication Skills\"",
      time: "1 hour ago",
      icon: "activity-feedback"
    },
    {
      id: "activity-4",
      title: "Badge Earned",
      description: "Alex Martinez earned \"Master Communicator\" badge",
      time: "2 hours ago",
      icon: "activity-badge"
    }
  ],
  summaries: [
    {
      id: "summary-feedback",
      title: "New Feedback",
      value: "18",
      label: "unread",
      subtitle: "Requires your attention",
      icon: "feedback"
    },
    {
      id: "summary-discussions",
      title: "Discussion Posts",
      value: "42",
      label: "new posts",
      subtitle: "Across all courses",
      icon: "discussion"
    },
    {
      id: "summary-badges",
      title: "Badges Awarded",
      value: "124",
      label: "this month",
        subtitle: "Keep motivating students!",
      icon: "badges"
    }
  ]
};

export async function getOverviewData(): Promise<OverviewData> {
  return overviewData;
}
