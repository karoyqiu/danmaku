import { appWindow } from '@tauri-apps/api/window';
import React from 'react';
import roomid from './lib/roomid';

export default function SignInPage() {
  const [input, setInput] = React.useState('');

  return (
    <div
      className="flex flex-col gap-4 p-8 items-center justify-center w-full h-full"
      onMouseDown={async (event) => {
        if (event.currentTarget === event.target) {
          await appWindow.startDragging();
        }
      }}
    >
      <input
        type="text"
        className="input input-bordered w-full"
        autoComplete="on"
        placeholder="Input room ID"
        autoFocus
        value={input}
        onChange={(event) => setInput(event.target.value)}
      />
      <button
        className="btn btn-primary"
        disabled={input.length === 0}
        onClick={() => {
          roomid.set(parseInt(input, 10));
        }}
      >
        Enter
      </button>
    </div>
  );
}
