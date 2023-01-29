import ky from "ky";

const apiClient = ky.create({
  prefixUrl: "https://my-sleeping.herokuapp.com/api",
  headers: {
    "Access-Control-Allow-Origin": "http://localhost:3000",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  },
});

let authClient = null;

export const initializeAuthClient = ({ authHeaders }) => {
  authClient = apiClient.extend({ headers: authHeaders });
};

export const apiSignIn = () =>
  authClient
    .post("login", {
      json: {},
    })
    .json();

export const apiGetUsers = () => authClient("users").json();
export const apiGetObjects = () => authClient("places").json();
export const apiGetConversations = () => authClient("chat").json();

export const apiGetUser = (userId) => authClient(`users/${userId}`).json();
export const apiGetObject = (objectId) =>
  authClient(`places/${objectId}`).json();

export const apiEditUser = (userId, userData) =>
  authClient.patch(`users/${userId}`, {
    json: { ...userData },
  });

export const apiEditObject = (objectId, objectData) => {
  authClient.put(`places/${objectId}`, {
    json: { ...objectData },
  });
};

export const apiDeleteUser = (userId) => authClient.delete(`users/${userId}`);
export const apiDeleteObject = (objectId) =>
  authClient.delete(`users/${objectId}`);

export const apiEditReservation = (reservationId, reservationData) =>
  authClient.put(`reservations/${reservationId}`, {
    json: { ...reservationData },
  });

export const apiCreateConversation = (username) =>
  authClient.post(`chat`, {
    json: {
      username,
    },
  });

export const apiSendMessage = (conversationId, message) =>
  authClient.post(`chat/${conversationId}`, {
    json: {
      message,
    },
  });

export const apiGetConversation = (conversationId) =>
  authClient(`chat/${conversationId}`).json();
