"use client";
import { useEffect, useState } from "react";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/contact");
        const data = await res.json();
        setMessages(data);
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
      </div>
    </div>
  );
}
