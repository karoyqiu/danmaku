import { invoke } from '@tauri-apps/api/tauri';
import { appWindow } from '@tauri-apps/api/window';
import React from 'react';

export default function App() {
  const [dragging, setDragging] = React.useState(false);

  React.useEffect(() => {
    const unlisten = appWindow.onFocusChanged(async (event) => {
      if (event.payload) {
        await invoke('enable_background');
      } else {
        setDragging(false);
        await invoke('disable_background');
      }
    });

    return () => {
      unlisten.then((fn) => fn()).catch(() => {});
    };
  }, []);

  return (
    <div
      className="flex flex-col-reverse gap-0 text-sky-400"
      onMouseEnter={() => invoke('enable_background')}
      onMouseLeave={async () => {
        if (!dragging) {
          await invoke('disable_background');
        }
      }}
      onMouseDown={async () => {
        setDragging(true);
        await appWindow.startDragging();
      }}
      style={{ width: '100%', height: '100%' }}
    >
      <span>aaa</span>
      <span>aaa</span>
      <span>aaa</span>
      <span>aaa</span>
      <span>aaa</span>
      <span>aaa</span>
    </div>
  );
}
