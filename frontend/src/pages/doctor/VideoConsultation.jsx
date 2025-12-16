import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Video,
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  MessageSquare,
  Share2,
  Users,
  Clock,
  MapPin,
} from "lucide-react";
import "./VideoConsultation.css";

function VideoConsultation({ appointmentId, onBack }) {
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [callStarted, setCallStarted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    fetchAppointment();
  }, [appointmentId]);

  useEffect(() => {
    let interval;
    if (callStarted) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStarted]);

  const fetchAppointment = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/appointments/${appointmentId}`
      );
      const data = await res.json();

      if (!res.ok) throw new Error("Failed to fetch appointment");

      setAppointment(data);
    } catch (error) {
      console.error("Error fetching appointment:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, "0")}:${String(
        secs
      ).padStart(2, "0")}`;
    }
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  const handleStartCall = () => {
    if (appointment?.meet_link) {
      window.open(appointment.meet_link, "_blank");
      setCallStarted(true);
    }
  };

  const handleEndCall = async () => {
    setCallStarted(false);
    try {
      await fetch(
        `http://localhost:5000/api/appointments/${appointmentId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "completed" }),
        }
      );
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setChatMessages([
        ...chatMessages,
        {
          id: Date.now(),
          sender: "Doctor",
          message: messageInput,
          timestamp: new Date(),
        },
      ]);
      setMessageInput("");
    }
  };

  if (loading) {
    return (
      <div className="consultation-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading consultation...</p>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="consultation-container">
        <button onClick={onBack} className="back-btn">
          <ArrowLeft size={20} />
          Back
        </button>
        <div className="error-state">
          <p>Appointment not found</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`consultation-container ${callStarted ? "call-active" : ""}`}
    >
      {!callStarted ? (
        <>
          <button onClick={onBack} className="back-btn">
            <ArrowLeft size={20} />
            Back
          </button>

          <div className="pre-call-section">
            <div className="pre-call-card">
              <div className="pre-call-header">
                <div className="video-preview">
                  <div className="preview-placeholder">
                    <div className="camera-icon">📹</div>
                    <p>Camera Feed</p>
                  </div>
                </div>

                <div className="pre-call-info">
                  <div className="patient-preview">
                    <div className="patient-avatar">
                      {appointment.patient_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2>{appointment.patient_name}</h2>
                      <p className="dept">{appointment.department}</p>
                      <p className="status ready">Ready to connect</p>
                    </div>
                  </div>

                  <div className="appointment-preview">
                    <div className="info-item">
                      <Clock size={18} />
                      <span>{appointment.appointment_time}</span>
                    </div>
                    <div className="info-item">
                      <Users size={18} />
                      <span>{appointment.patient_email}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pre-call-settings">
                <h3>Check Your Settings</h3>
                <div className="settings-grid">
                  <div className="setting-card">
                    <div
                      className={`setting-icon ${
                        isMicOn ? "active" : "inactive"
                      }`}
                    >
                      {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
                    </div>
                    <span>{isMicOn ? "Microphone On" : "Microphone Off"}</span>
                  </div>
                  <div className="setting-card">
                    <div
                      className={`setting-icon ${
                        isVideoOn ? "active" : "inactive"
                      }`}
                    >
                      {isVideoOn ? (
                        <Video size={24} />
                      ) : (
                        <Video size={24} style={{ opacity: 0.4 }} />
                      )}
                    </div>
                    <span>{isVideoOn ? "Camera On" : "Camera Off"}</span>
                  </div>
                </div>
              </div>

              <div className="pre-call-actions">
                <button
                  onClick={handleStartCall}
                  className="btn btn-start-call"
                >
                  <Video size={20} />
                  Start Video Call
                </button>
              </div>

              <div className="consultation-details">
                <h3>Consultation Details</h3>
                <div className="details">
                  <div className="detail">
                    <span className="label">Date & Time</span>
                    <span className="value">
                      {new Date(
                        appointment.appointment_date
                      ).toLocaleDateString()}
                      , {appointment.appointment_time}
                    </span>
                  </div>
                  <div className="detail">
                    <span className="label">Reason</span>
                    <span className="value">{appointment.symptoms}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="active-call-section">
          <div className="call-header">
            <div className="call-info">
              <h3>{appointment.patient_name}</h3>
              <div className="call-duration">
                <span className="pulse-dot"></span>
                <span>{formatDuration(callDuration)}</span>
              </div>
            </div>
            <div className="call-actions">
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`control-btn ${isMicOn ? "active" : "inactive"}`}
                title="Toggle Microphone"
              >
                {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
              </button>
              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`control-btn ${isVideoOn ? "active" : "inactive"}`}
                title="Toggle Camera"
              >
                {isVideoOn ? <Video size={20} /> : <Video size={20} />}
              </button>
              <button
                onClick={() => setShowChat(!showChat)}
                className="control-btn"
                title="Toggle Chat"
              >
                <MessageSquare size={20} />
              </button>
              <button className="control-btn" title="Share Screen">
                <Share2 size={20} />
              </button>
              <button
                onClick={handleEndCall}
                className="control-btn end-call"
                title="End Call"
              >
                <PhoneOff size={20} />
              </button>
            </div>
          </div>

          <div className="call-content">
            <div className="video-area">
              <div className="main-video">
                <div className="video-placeholder">
                  <div className="avatar-large">
                    {appointment.patient_name.charAt(0).toUpperCase()}
                  </div>
                  <h2>{appointment.patient_name}</h2>
                  <p>{appointment.department}</p>
                </div>
              </div>
              <div className="self-video">
                <div className="self-video-placeholder">
                  <span>You</span>
                </div>
              </div>
            </div>

            {showChat && (
              <div className="chat-panel">
                <div className="chat-header">
                  <h4>Chat</h4>
                  <button
                    onClick={() => setShowChat(false)}
                    className="close-chat"
                  >
                    ×
                  </button>
                </div>
                <div className="chat-messages">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="message">
                      <span className="sender">{msg.sender}</span>
                      <p>{msg.message}</p>
                    </div>
                  ))}
                </div>
                <div className="chat-input">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type a message..."
                    className="input"
                  />
                  <button onClick={handleSendMessage} className="send-btn">
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="decorative-bg">
        <div className="shape s1"></div>
        <div className="shape s2"></div>
        <div className="shape s3"></div>
      </div>
    </div>
  );
}

export default VideoConsultation;
