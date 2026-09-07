import { useState } from "react";

function Tickets() {
  const tickets = [
    {
      id: "TKT-2048",
      title: "Pension application assistance",
      category: "Government Support",
      status: "In Progress",
      updated: "Today",
      progress: 65,
      messages: [
        {
          sender: "saheli",
          text: "Your pension assistance ticket is currently being reviewed.",
        },
        {
          sender: "user",
          text: "When can I expect an update?",
        },
        {
          sender: "saheli",
          text: "The support team has completed the initial verification. I will keep you updated here.",
        },
      ],
    },
    {
      id: "TKT-2035",
      title: "Document verification",
      category: "Documents",
      status: "Waiting for Documents",
      updated: "Yesterday",
      progress: 40,
      messages: [
        {
          sender: "saheli",
          text: "We need one additional document to continue processing your request.",
        },
      ],
    },
    {
      id: "TKT-2019",
      title: "Service payment issue",
      category: "Payments",
      status: "Resolved",
      updated: "12 Aug",
      progress: 100,
      messages: [
        {
          sender: "saheli",
          text: "Your payment issue has been resolved. Please let us know if you need any further help.",
        },
      ],
    },
  ];

  const [selectedTicket, setSelectedTicket] = useState(tickets[0]);
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (!message.trim()) return;

    setMessage("");
  };

  return (
    <div className="tickets-page">

      {/* PAGE HEADER */}
      <div className="tickets-page-header">
        <div>
          <span className="section-label">
            SUPPORT
          </span>

          <h2>Support Tickets</h2>

          <p>
            Track your requests and chat with our support team.
          </p>
        </div>

        <button className="new-ticket-button">
          + Raise a Ticket
        </button>
      </div>

      {/* MAIN WORKSPACE */}
      <div className="tickets-workspace">

        {/* LEFT — TICKETS */}
        <div className="tickets-list-card">

          <div className="tickets-list-header">
            <h3>My Tickets</h3>

            <span>
              {tickets.length} tickets
            </span>
          </div>

          <div className="ticket-list">

            {tickets.map((ticket) => (
              <button
                key={ticket.id}
                className={`ticket-item ${
                  selectedTicket.id === ticket.id
                    ? "selected"
                    : ""
                }`}
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="ticket-item-top">
                  <strong>{ticket.title}</strong>

                  <span
                    className={`ticket-status ${
                      ticket.status === "Resolved"
                        ? "resolved"
                        : ""
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>

                <div className="ticket-item-bottom">
                  <span>{ticket.id}</span>
                  <span>{ticket.updated}</span>
                </div>
              </button>
            ))}

          </div>

        </div>

        {/* RIGHT — CHAT */}
        <div className="ticket-chat-card">

          {/* CHAT HEADER */}
          <div className="ticket-chat-header">

            <div>
              <span className="ticket-chat-label">
                SUPPORT CHAT
              </span>

              <h3>{selectedTicket.title}</h3>

              <p>
                {selectedTicket.id} · {selectedTicket.category}
              </p>
            </div>

            <div
              className={`ticket-header-status ${
                selectedTicket.status === "Resolved"
                  ? "resolved"
                  : ""
              }`}
            >
              {selectedTicket.status}
            </div>

          </div>

          {/* PROGRESS */}
          <div className="ticket-progress">

            <div className="ticket-progress-header">
              <span>Ticket progress</span>
              <strong>
                {selectedTicket.progress}%
              </strong>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${selectedTicket.progress}%`,
                }}
              />
            </div>

            <div className="progress-steps">
              <span className="completed">
                Raised
              </span>

              <span
                className={
                  selectedTicket.progress >= 40
                    ? "completed"
                    : ""
                }
              >
                Reviewing
              </span>

              <span
                className={
                  selectedTicket.progress >= 70
                    ? "completed"
                    : ""
                }
              >
                Processing
              </span>

              <span
                className={
                  selectedTicket.progress === 100
                    ? "completed"
                    : ""
                }
              >
                Resolved
              </span>
            </div>

          </div>

          {/* MESSAGES */}
          <div className="ticket-messages">

            {selectedTicket.messages.map(
              (msg, index) => (
                <div
                  key={index}
                  className={`ticket-message ${
                    msg.sender === "user"
                      ? "user"
                      : "support"
                  }`}
                >
                  <div className="ticket-message-bubble">
                    {msg.text}
                  </div>
                </div>
              )
            )}

            <div className="ticket-system-message">
              Ticket status: {selectedTicket.status}
            </div>

          </div>

          {/* CHAT INPUT */}
          <div className="ticket-chat-input">

            <input
              type="text"
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  sendMessage();
                }
              }}
              placeholder="Ask about your ticket..."
            />

            <button
              onClick={sendMessage}
            >
              Send
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Tickets;