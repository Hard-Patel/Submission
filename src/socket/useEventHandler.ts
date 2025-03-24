/**
 * @format
 */
import { useCallback } from "react";
import { useSocketEventHandler } from "./useSocketEventHandler";
import { I_SOCKET_EVENTS } from "interface/socket";

const useEventHandlers = () => {
  const { handleEvent, handleLiveEvent } = useSocketEventHandler();

  const handleSocketEvent = useCallback((ev: I_SOCKET_EVENTS, payload: any) => {
    console.log("ev, payload: ", ev, payload);
    // const { device_id, data } = payload;
    switch (ev) {
      case I_SOCKET_EVENTS.TELE_DATA:
      case I_SOCKET_EVENTS.COMMAND_ACK:
        handleEvent(ev, payload);
        break;
      case I_SOCKET_EVENTS.IS_LIVE:
        handleLiveEvent(ev, payload);
      default:
        break;
    }
  }, []);

  return {
    handleSocketEvent,
  };
};

export { useEventHandlers };
