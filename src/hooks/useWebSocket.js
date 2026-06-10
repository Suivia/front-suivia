import { useEffect, useRef, useState } from "react";
import { WS_URL } from "../config";

export function useWebSocket(onMessage) {
  const ws      = useRef(null);
  const [status, setStatus] = useState("disconnected");

  useEffect(() => {
    const token = localStorage.getItem("suivia_token") || "";
    const url   = `${WS_URL}?token=${token}`;
    const socket = new WebSocket(url);
    ws.current = socket;

    socket.onopen    = () => setStatus("connected");
    socket.onclose   = () => setStatus("disconnected");
    socket.onerror   = () => setStatus("error");
    socket.onmessage = e => { try { onMessage(JSON.parse(e.data)); } catch {} };

    return () => socket.close();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return status;
}
