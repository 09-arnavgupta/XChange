import React, { useState, useRef } from "react";
import axios from "axios";

const TAG_OPTIONS = ["Clothing", "Electronics", "Books", "Shoes", "Accessories", "Other"];

export default function AIPage() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! What would you like to do today? (Type: 'find' or 'list')" }
  ]);
  const [input, setInput] = useState("");
  const [awaitingImage, setAwaitingImage] = useState(false);
  const [awaitingTags, setAwaitingTags] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const fileInputRef = useRef();

  const sendMessage = async (msg) => {
    setMessages((prev) => [...prev, { sender: "user", text: msg }]);
    setInput("");

    // If bot is waiting for image
    if (awaitingImage) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Please upload an image." }]);
      fileInputRef.current.click();
      return;
    };

    // If bot is waiting for tags
    if (awaitingTags) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Please select tags:" }]);
      return;
    }

    // Send message to backend
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/exchange/ai-agent/`,
        { message: msg, tags: selectedTags }
      );
      const botReply = res.data.reply || "OK";
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);

      // Check for bot instructions
      if (botReply.toLowerCase().includes("upload an image")) setAwaitingImage(true);
      if (botReply.toLowerCase().includes("choose tags")) setAwaitingTags(true);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Error: " + (err.response?.data?.error || "Request failed") }]);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAwaitingImage(false);
    setMessages((prev) => [...prev, { sender: "user", text: "[Image uploaded]" }]);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/exchange/ai-agent/`,
        formData
      );
      setMessages((prev) => [...prev, { sender: "bot", text: res.data.reply || "Image received." }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Error: " + (err.response?.data?.error || "Request failed") }]);
    }
  };

  const handleTagSelect = (tag) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
  };

  const handleTagsSubmit = async () => {
    setAwaitingTags(false);
    setMessages((prev) => [...prev, { sender: "user", text: `[Tags: ${selectedTags.join(", ")}]` }]);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/exchange/ai-agent/`,
        { tags: selectedTags }
      );
      setMessages((prev) => [...prev, { sender: "bot", text: res.data.reply || "Tags received." }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Error: " + (err.response?.data?.error || "Request failed") }]);
    }
    setSelectedTags([]);
  };

  return (
    <div className="chatbot-container" style={{ maxWidth: 600, margin: "2rem auto" }}>
      <div style={{ background: "#f7f7f7", padding: "1rem", borderRadius: 8, minHeight: 400 }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.sender === "bot" ? "left" : "right", margin: "0.5rem 0" }}>
            <span style={{ fontWeight: msg.sender === "bot" ? "bold" : "normal" }}>
              {msg.sender === "bot" ? "🤖 " : "🧑 "}
            </span>
            {msg.text}
          </div>
        ))}
      </div>
      {awaitingTags ? (
        <div style={{ margin: "1rem 0" }}>
          {TAG_OPTIONS.map(tag => (
            <button
              key={tag}
              style={{
                margin: 4,
                background: selectedTags.includes(tag) ? "#667eea" : "#eee",
                color: selectedTags.includes(tag) ? "#fff" : "#333",
                border: "none",
                borderRadius: 4,
                padding: "0.5rem 1rem"
              }}
              onClick={() => handleTagSelect(tag)}
            >
              {tag}
            </button>
          ))}
          <button onClick={handleTagsSubmit} style={{ marginLeft: 8 }}>Submit Tags</button>
        </div>
      ) : (
        <form
          onSubmit={e => {
            e.preventDefault();
            if (input.trim()) sendMessage(input.trim());
          }}
          style={{ display: "flex", marginTop: "1rem" }}
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            style={{ flex: 1, padding: "0.5rem" }}
            disabled={awaitingImage}
          />
          <button type="submit" disabled={awaitingImage}>Send</button>
        </form>
      )}
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleImageUpload}
      />
    </div>
  );
}