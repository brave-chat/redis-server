import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";

import SendIcon from "@mui/icons-material/Send";
import IconButton from "@mui/material/IconButton";
import "./style.css";
import AttachFileIcon from "@mui/icons-material/Attachment";

import {
  sendNewMediaMessage,
  sendTextMessage,
  sendRoomTextMessage,
} from "../../api/Axios";

import { sendMediaMessage } from "../../redux/appReducer/actions";
import CustomTextInput from "../CustomTextInput";
import { authUser } from "../../redux/appReducer/selectors";

const ChatFooter = ({ receiver }) => {
  const [message, setMessage] = useState("");
  const sender = useSelector(authUser);

  const dispatch = useDispatch();

  const onSendMessage = () => {
    if (message) {
      if (receiver.room_name) {
        dispatch(sendRoomTextMessage(sender, receiver, message));
      }
      if (receiver.first_name) {
        dispatch(sendTextMessage(sender, receiver, message));
      }
      setMessage("");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    multiple: true,
    onDrop: (acceptedFiles) => {
      const files = acceptedFiles.map((file) => {
        dispatch(sendNewMediaMessage(receiver.pk, file));
        return {
          preview: URL.createObjectURL(file),
          name: file.name,
          ...file,
          metaData: { type: file.type, size: file.size },
        };
      });
      dispatch(sendMediaMessage(files));
    },
  });

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey && message) {
      if (receiver.room_name) {
        dispatch(sendRoomTextMessage(sender, receiver, message));
      }
      if (receiver.first_name) {
        dispatch(sendTextMessage(sender, receiver, message));
      }
      event.preventDefault();
      setMessage("");
    }
  };

  return (
    <div className="chat-footer-root">
      <input {...getInputProps()} />
      <IconButton className="icon-btn-root" {...getRootProps()}>
        <AttachFileIcon />
      </IconButton>
      <CustomTextInput
        id="chat-textarea"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type message..."
        variant="outlined"
        multiline
        className="text-field-root"
      />
      <IconButton className="icon-btn-root" onClick={onSendMessage}>
        <SendIcon />
      </IconButton>
    </div>
  );
};

export default ChatFooter;
