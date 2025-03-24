/**
 * @format
 */
import React, { useContext } from "react";
import { useSelector } from "react-redux";
import io, { Socket } from "socket.io-client";
import Config from "react-native-config";
import { useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { useEventHandlers } from "../socket/useEventHandler";

let userLoggedIn = false;
let errorVisible = false;
const initialState: ISocketContext = {
  socketStatus: false,
  socket: null,
  disconnectSocket: () => {},
};

interface ISocketProviderStatusState {
  socketStatus: boolean;
  socket: Socket | null;
}

interface ISocketContext extends ISocketProviderStatusState {
  disconnectSocket: () => void;
}

const SocketContext = React.createContext<ISocketContext>(initialState);

const key = "socket";

const SocketProvider = (props: any) => {
  const socketUrl: string = Config?.SOCKET_URL as string;

  const dispatch = useDispatch();
  const [socketStatus, setSocketStatus] =
    React.useState<ISocketProviderStatusState>({
      socketStatus: false,
      socket: null,
    });
  const { handleSocketEvent } = useEventHandlers();

  const user = useSelector((state: RootState) => state.user.user);

  React.useEffect(() => {
    const token = user?.authentication?.token;
    if (token) {
      console.log("initialState: ", initialState);
      if (initialState.socket != null) {
        return;
      }

      const setSocket = (status: boolean = false) => {
        setSocketStatus((sStatus) => {
          return { ...sStatus, socketStatus: status };
        });
      };
      const onDisconnect = () => {
        console.log("Socket disconnecting...  ");
        setSocket(false);
      };

      const onError = (e: any) => {
        console.log('e: ', e);
        console.log("Socket connecting error..  ");
        setSocket(false);
      };

      userLoggedIn = true;

      const socketOptions = {
        reconnectionDelayMax: 10000,
        path: "/socket",
        transports: ["websocket"],
        forceNew: true,
        reconnectionAttempts: Infinity,
        autoConnect: true,
        reconnectionDelay: 3000,
        timeout: 4000,
        auth: {
          token: `${token}`,
        },
      };
      socketStatus.socket?.disconnect();
      console.log('socketUrl, token: ', socketUrl, token);
      console.log('socketOptions: ', socketOptions);
      socketStatus.socket = io(socketUrl, socketOptions);

      socketStatus.socket.on("connect", () => {
        socketStatus.socket?.onAny(handleSocketEvent);
        errorVisible = false;
        setSocket(true);
        console.log("Socket connected ");
      });

      socketStatus.socket?.on("disconnect", onDisconnect);
      socketStatus.socket?.on("connect_error", onError);
    } else {
      if (initialState.socket != null) {
        socketStatus.socket?.disconnect();
        socketStatus.socket = null;
      } else {
      }
    }
  }, [dispatch, user]);

  const disconnectSocket = () => {
    if (initialState.socket != null && socketStatus.socketStatus) {
      console.log("Disconnecting the socket");
      socketStatus?.socket?.disconnect();
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socketStatus: socketStatus.socketStatus,
        socket: socketStatus.socket,
        disconnectSocket: disconnectSocket,
      }}
    >
      {props.children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
