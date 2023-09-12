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
      onMouseDown={async () => {
        await appWindow.startDragging();
      }}
      style={{ width: '100%', height: '100%' }}
    >
      {items.map((item) => (
        <div key={item.id} className="chat chat-start">
          <div className="chat-header">{item.user}</div>
          <div className="chat-bubble text-sky-300">{item.message}</div>
        </div>
      ))}
    </div>
  );
}
