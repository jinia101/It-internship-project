import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ServicesMenu } from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";

const previousFeedbacks = [
  {
    id: 1,
    message: "Great service, but could be faster.",
    date: "2024-07-20",
    status: "Pending",
  },
  {
    id: 2,
    message: "Had trouble with the application form.",
    date: "2024-07-19",
    status: "Resolved",
  },
];

export default function UserFeedbackService() {
  const [feedback, setFeedback] = useState("");
  const stats = {
    published: 156,
    active: 23,
    total: 179,
  };

  return (
    <div className="flex min-h-screen">
      <ServicesMenu />
      <div className="flex-1 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Feedback Service</h1>
          <p className="text-gray-600 mb-8">
            Send your feedback to the admin team.
          </p>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Published Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.published}
                </div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.active}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently in use
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {stats.total}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all categories
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Feedback Form */}
          <Card className="w-full px-8 md:px-12 mx-auto">
            <CardHeader>
              <CardTitle>Send Feedback</CardTitle>
              <CardDescription>
                Share your feedback with the admin team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Write your feedback here..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="mb-4"
                rows={6}
              />
              <Button
                className="w-full"
                disabled={!feedback.trim()}
                onClick={() => setFeedback("")}
              >
                Send Feedback
              </Button>
            </CardContent>
          </Card>

          {/* Previous Feedbacks Section */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">Your Previous Feedbacks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {previousFeedbacks.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-gray-500">
                    No previous feedbacks.
                  </CardContent>
                </Card>
              ) : (
                previousFeedbacks.map((fb) => (
                  <Card
                    key={fb.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <CardTitle
                        className={`text-base inline-block px-3 py-1 rounded-md font-semibold w-fit ${fb.status === "Pending" ? "bg-yellow-200 text-yellow-800" : "bg-green-200 text-green-800"}`}
                      >
                        {fb.status}
                      </CardTitle>
                      <CardDescription>{fb.date}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div>{fb.message}</div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
