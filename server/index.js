const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
const { connectDb } = require("./db/connection");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

require("dotenv").config();
app.use(express.json());
connectDb();
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.send("<center><h1>Hello bantai log</h1></center>");
});
app.use("/api", require("./routes/route"));

const users = {};
const conversationMessageCounts = {};

io.on("connection", (socket) => {
  console.log(socket.id, "Connected");
  // send a welcome message to the connected client
  socket.emit("welcome", `Welcome to the chat server ${socket.id}`);

  // handle the inititate-chat event
  socket.on("initiate-chat", ({ senderEmail, recipientEmail }) => {
    // store the recipient's socket id
    users[senderEmail] = socket.id;
    console.log(Object.keys(users).length);
    // notify the recipient about the new user
    if (users[recipientEmail]) {
      // notify both the sender and the recipient that the chat is initiated
      io.to(users[recipientEmail]).emit("chat-initiated", senderEmail);
      io.to(users[senderEmail]).emit("chat-initiated", recipientEmail);
    } else {
      // handle offline user
      console.log(`User ${recipientEmail} is offline`);
      // notify the sender that the recipient is offline
      io.to(users[senderEmail]).emit("recipient-offline", recipientEmail);
    }
  });

  // handle sending messages
  socket.on("send-message", ({ senderEmail, recipientEmail, message }) => {
    // send the message to the recipient/receiver
    console.log({ senderEmail, recipientEmail, message });
    if (users[recipientEmail]) {
      // send the message only to the recipient
      io.to(users[recipientEmail]).emit("receive-message", {
        senderEmail,
        message,
      });
    } else {
      // handle offline user
      console.log(`User ${recipientEmail} is offline`);
      // notify the sender that the recipient is offline
      io.to(users[senderEmail]).emit("recipient-offline", recipientEmail);
    }

    // Track conversation key (sorted emails for uniqueness)
    const conversationKey = [senderEmail, recipientEmail].sort().join(":");
    conversationMessageCounts[conversationKey] = (conversationMessageCounts[conversationKey] || 0) + 1;

    // Prevent sending messages after 30
    if (conversationMessageCounts[conversationKey] > 30) {
      // Optionally, you can send a notification or just ignore
      return;
    }

    // After 20 messages, send automated place suggestion
    if (conversationMessageCounts[conversationKey] === 20) {
      const autoMsg = 'You can visit ' +
        '<a href="https://www.google.com/maps/dir//Seventh+Block,+Plot+118,+80+Feet+Rd,+above+Bodyworks+Spa,+KHB+Colony,+7th+Block,+Koramangala,+Bengaluru,+Karnataka+560095/@12.9354636,77.5317514,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3bae144e0d9adf39:0xc8064976a76aefa2!2m2!1d77.6141708!2d12.9354676?entry=ttu&g_ep=EgoyMDI1MDUxMS4wIKXMDSoASAFQAw%3D%3D" target="_blank" style="color:#2563eb;text-decoration:underline;">Social Koramangala</a>';
      if (users[senderEmail]) {
        io.to(users[senderEmail]).emit("receive-message", {
          senderEmail: "CheersBot",
          message: autoMsg,
          isHtml: true
        });
      }
      if (users[recipientEmail]) {
        io.to(users[recipientEmail]).emit("receive-message", {
          senderEmail: "CheersBot",
          message: autoMsg,
          isHtml: true
        });
      }
    }
    // After 30 messages, send thank you message with clickable email
    if (conversationMessageCounts[conversationKey] === 30) {
      const senderMailMsg = `Thank you for choosing Cheers. For further conversation please use <a href=\"mailto:${recipientEmail}\" style=\"color:#2563eb;text-decoration:underline;\">${recipientEmail}</a>`;
      const recipientMailMsg = `Thank you for choosing Cheers. For further conversation please use <a href=\"mailto:${senderEmail}\" style=\"color:#2563eb;text-decoration:underline;\">${senderEmail}</a>`;
      if (users[senderEmail]) {
        io.to(users[senderEmail]).emit("receive-message", {
          senderEmail: "CheersBot",
          message: senderMailMsg,
          isHtml: true
        });
      }
      if (users[recipientEmail]) {
        io.to(users[recipientEmail]).emit("receive-message", {
          senderEmail: "CheersBot",
          message: recipientMailMsg,
          isHtml: true
        });
      }
    }
  });

  // handle the disconnect event
  socket.on("disconnect", () => {
    console.log(socket.id, "Disconnected");
    // remove the socket id form the user object
    const email = Object.keys(users).find((key) => users[key] === socket.id);
    if (email) {
      delete users[email];
    }
  });
});

server.listen(port, () => console.log(`Server is running on port ${port}`));
