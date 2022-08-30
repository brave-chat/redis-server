import moment from "moment";
import {
  SEND_NEW_CHAT_MESSAGE,
  SEND_NEW_MEDIA_MESSAGE,
  SET_CHAT_USERS,
  SET_CONTACT_USERS,
  SET_ROOMS_USER,
  SET_SELECTED_USER_ROOM,
  SET_CONVERSATION_DATA,
  SET_ROOM_CONVERSATION_DATA,
  SEND_NEW_MEDIA_MESSAGE_ROOM,
  SEND_NEW_CHAT_MESSAGE_ROOM,
  RECEIVE_NEW_CHAT_MESSAGE_ROOM,
  RECEIVE_NEW_CHAT_MESSAGE,
  SET_CURRENT_USER,
  SET_SEARCH_DATA,
  SET_SELECTED_USER,
  UPDATE_AUTH_USER,
  UPDATE_LOAD_USER,
  FETCH_ERROR,
  FETCH_START,
  FETCH_SUCCESS,
} from "../../constants/ActionTypes";

const initialState = {
  users: [],
  contacts: [],
  conversation: [],
  roomConversation: [],
  rooms: [],
  currentUser: null,
  selectedUser: null,
  selectedRoom: null,
  authUser: "",
  loadUser: false,
  search: "",
  error: "",
  message: "",
  loading: false,
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CHAT_USERS: {
      return { ...state, users: action.payload };
    }
    case SET_CONTACT_USERS: {
      return { ...state, contacts: action.payload };
    }
    case SET_ROOMS_USER: {
      return { ...state, rooms: action.payload };
    }
    case SET_CURRENT_USER: {
      return { ...state, currentUser: action.payload };
    }
    case SET_SELECTED_USER: {
      return { ...state, selectedUser: action.payload };
    }
    case SET_SELECTED_USER_ROOM: {
      return { ...state, selectedRoom: action.payload };
    }
    case SET_CONVERSATION_DATA: {
      return {
        ...state,
        conversation: action.payload,
      };
    }
    case SET_ROOM_CONVERSATION_DATA: {
      return {
        ...state,
        roomConversation: action.payload,
      };
    }
    case SEND_NEW_CHAT_MESSAGE: {
      return {
        ...state,
        conversation: state.conversation.concat({
          pk: new Date().getTime(),
          user: state.currentUser,
          content: action.payload,
          type_: "sent",
          message_type: "text",
          creation_date: moment.utc(),
        }),
      };
    }
    case RECEIVE_NEW_CHAT_MESSAGE: {
      return {
        ...state,
        conversation: state.conversation.concat({
          pk: new Date().getTime(),
          user: action.payload.user,
          content: action.payload.content,
          type_: "received",
          message_type: "text",
          creation_date: moment.utc(),
        }),
      };
    }
    case SEND_NEW_CHAT_MESSAGE_ROOM: {
      return {
        ...state,
        roomConversation: state.roomConversation.concat({
          pk: new Date().getTime(),
          user: state.currentUser,
          content: action.payload,
          type_: "sent",
          message_type: "text",
          creation_date: moment.utc(),
        }),
      };
    }
    case RECEIVE_NEW_CHAT_MESSAGE_ROOM: {
      return {
        ...state,
        roomConversation: state.roomConversation.concat({
          pk: new Date().getTime(),
          sender: action.payload.user,
          content: action.payload.content,
          type_: "received",
          message_type: "text",
          creation_date: moment.utc(),
        }),
      };
    }
    case SEND_NEW_MEDIA_MESSAGE: {
      return {
        ...state,
        conversation: state.conversation.concat({
          pk: new Date().getTime(),
          user: state.currentUser,
          type_: "sent",
          message_type: "media",
          content: "",
          media: action.payload,
          creation_date: moment.utc(),
        }),
      };
    }
    case SEND_NEW_MEDIA_MESSAGE_ROOM: {
      return {
        ...state,
        roomConversation: state.roomConversation.concat({
          pk: new Date().getTime(),
          user: state.currentUser,
          type_: "sent",
          message_type: "media",
          content: "",
          media: action.payload,
          creation_date: moment.utc(),
        }),
      };
    }
    case SET_SEARCH_DATA: {
      return {
        ...state,
        search: action.payload,
      };
    }
    case UPDATE_AUTH_USER: {
      return {
        ...state,
        authUser: action.payload,
        loadUser: true,
      };
    }
    case UPDATE_LOAD_USER: {
      return {
        ...state,
        loadUser: action.payload,
      };
    }
    case FETCH_START: {
      return { ...state, error: "", message: "", loading: true };
    }
    case FETCH_SUCCESS: {
      return { ...state, error: "", loading: false, message: action.payload };
    }
    case FETCH_ERROR: {
      return { ...state, loading: false, message: "", error: action.payload };
    }
    default:
      return state;
  }
};

export default appReducer;