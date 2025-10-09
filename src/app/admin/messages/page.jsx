"use client";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [subjectData, setSubjectData] = useState([]);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/contact");
        const data = await res.json();
        setMessages(data);

        // Create subject count data
        const subjects = data.map((msg) => msg.subject);
        const subjectCounts = subjects.reduce((acc, subject) => {
          acc[subject] = (acc[subject] || 0) + 1;
          return acc;
        }, {});

        setSubjectData(Object.entries(subjectCounts).map(([subject, count]) => ({ subject, count })));
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  // Delete message
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    await fetch(`/api/contact/${id}`, { method: "DELETE" });
    setMessages(messages.filter((msg) => msg._id !== id));
    setSelectedMessage(null);
  };

  if (loading) return <p className="p-6">Loading messages...</p>;

  // Pie Chart Data
  const pieData = {
    labels: subjectData.map((item) => item.subject),
    datasets: [
      {
        label: "Message Subjects",
        data: subjectData.map((item) => item.count),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#FF9F40"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-6">User Messages</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Messages List */}
        <div className="space-y-3">
          {messages.length === 0 ? (
            <p>No messages found.</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg._id}
                className="p-4 border rounded-lg shadow hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedMessage(msg)}
              >
                <p className="font-semibold">{msg.name}</p>
                <p className="text-sm text-gray-600">{msg.email}</p>
                <p className="text-sm truncate">{msg.subject}</p>
              </div>
            ))
          )}
        </div>

        {/* Message Details */}
        <div className="border rounded-lg p-4 bg-gray-50 shadow-md">
          {selectedMessage ? (
            <>
              <h2 className="text-lg font-bold mb-2">Message Details</h2>
              <p><strong>Name:</strong> {selectedMessage.name}</p>
              <p><strong>Email:</strong> {selectedMessage.email}</p>
              <p><strong>Phone:</strong> {selectedMessage.phone || "N/A"}</p>
              <p><strong>Subject:</strong> {selectedMessage.subject}</p>
              <p className="mt-2"><strong>Message:</strong></p>
              <p className="whitespace-pre-line">{selectedMessage.message}</p>

              <button
                onClick={() => handleDelete(selectedMessage._id)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete Message
              </button>
            </>
          ) : (
            <p>Select a message to view details</p>
          )}
        </div>

        {/* Pie Chart */}
        <h1 className="text-2xl font-bold mb-1">Distribution of Message Topics</h1>
        <div className="col-span-2 flex justify-center items-center">
          <div style={{ width: "250px", height: "250px" }}>
            <Pie data={pieData} />
          </div>
        </div>
      </div>
    </div>
  );
}
