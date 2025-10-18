import { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext.jsx";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const { user } = useAuth();

	useEffect(() => {
		if (user) {
			const newSocket = io("http://localhost:5000", {
				query: {
					userId: user._id,
				},
			});

			setSocket(newSocket);

			// Listen for the list of online users from the server
			newSocket.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
			});

			// Cleanup function to close the socket when the component unmounts or user logs out
			return () => newSocket.close();
		} else {
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
	}, [user]);

	return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};