import { appWindow } from '@tauri-apps/api/window';
import React from 'react';
import LiveDanmaku, { Danmaku } from './lib/liveDanmaku';
import roomid from './lib/roomid';

export default function DanmakuPage() {
  const [items, setItems] = React.useState<Danmaku[]>([]);
  const rid = roomid.use();

  const appendItem = React.useCallback((item: Danmaku) => {
    setItems((original) => {
      if (original.length >= 128) {
        const rest = original.slice(0, -1);
        return [item, ...rest];
      }

      return [item, ...original];
    });
  }, []);

  React.useEffect(() => {
    const danmaku = new LiveDanmaku(appendItem);
    danmaku.open(rid);

    return () => danmaku.close();
  }, [rid]);

  return (
    <div
      className="flex flex-col-reverse gap-2 p-2 overflow-y-auto"
      onMouseDown={async (event) => {
        if (event.currentTarget === event.target) {
          await appWindow.startDragging();
        }
      }}
      style={{ width: '100%', height: '100%' }}
    >
      {items.map((item) => (
        <div key={item.id} className="chat chat-start">
          <div className="chat-image avatar placeholder">
            <div className="w-8 bg-neutral-focus text-neutral-content rounded-full">
              {item.user.substring(0, 1)}
            </div>
          </div>
          <div className="chat-bubble text-sky-300">{item.message}</div>
        </div>
      ))}
      <button
        className="btn btn-circle btn-ghost absolute right-6 top-2"
        onClick={() => roomid.set(0)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            d="M14 7.63636L14 4.5C14 4.22386 13.7761 4 13.5 4L4.5 4C4.22386 4 4 4.22386 4 4.5L4 19.5C4 19.7761 4.22386 20 4.5 20L13.5 20C13.7761 20 14 19.7761 14 19.5L14 16.3636"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 12L21 12M21 12L18.0004 8.5M21 12L18 15.5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
