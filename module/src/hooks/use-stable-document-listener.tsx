import { useEffect, useRef } from "react";

/**
 * Runs `handler` after every render and whenever `document` fires `type`, while keeping
 * exactly one listener registered per hook instance.
 *
 * The ref lets the listener stay mounted across renders without ever reading a stale
 * closure, so consumers do not re-register on each render.
 */
export default function useStableDocumentListener(
  type: string,
  handler: () => void,
) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    handlerRef.current();
  });

  useEffect(() => {
    const listener = () => handlerRef.current();

    document.addEventListener(type, listener);

    return () => {
      document.removeEventListener(type, listener);
    };
  }, [type]);
}
