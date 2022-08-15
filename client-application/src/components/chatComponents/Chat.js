import React, { useEffect, useState } from "react";

//scroll to bottom dynamicly scroll container to botton on addition of new element
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, creatorUID, uID, currActiveChat, currJoinedChats, setCurrActiveChat, setCurrJoinedChat }) {

  //defining state variables
  const [currentMessage, setCurrentMessage] = useState("");

  //funcation for sending new message
  const sendMessage = async () => {

    if (currentMessage !== "") {
      const messageData = {
        room: currActiveChat.room,
        author: username,
        phoneNo: currActiveChat.phoneNo,
        message: currentMessage,
        creatorUID,
        uID,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      //emitting new message and storing it in the currActiveChat
      await socket.emit("send_message", messageData);
      setCurrActiveChat((chat) => {
          return {...chat, messageList: [...chat.messageList, messageData]}
      });
      setCurrentMessage("");

      //storing the message in the currJoinedChats so that it can be send to backend for storing the chat in the database
      currJoinedChats.forEach((chat, index) => {
        if(chat.room === currActiveChat.room){
          setCurrJoinedChat((curr) => {
            curr[index].messageList = [...curr[index].messageList, messageData];
            return [...curr];
          })
        }
      })

    }
  };

  useEffect(() => {

    //on reciving the new message populating it on the page and storing it in the currJoinedChats
    socket.on("receive_message", (data) => {

      if(data.room === currActiveChat.room){
        setCurrActiveChat((chat) => {
            return {...chat, messageList: [...chat.messageList, data]}
        });
      }
      currJoinedChats.forEach((chat, index) => {
        if(chat.room === data.room){
          setCurrJoinedChat((curr) => {
            curr[index].messageList = [...curr[index].messageList, data];
            return [...curr];
          })
        }
      })
    });


    return () => {
      socket.removeListener('receive_message');
    }

  }, [socket, currActiveChat.room]);

  return (
    <div className="chat-window">
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {currActiveChat.messageList.map((messageContent, index) => {
            return (
              <div
                key={index}
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Type Here..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
