import { appWindow } from '@tauri-apps/api/window';
import React from 'react';
import roomid from './lib/roomid';

export default function SignInPage() {
  const [input, setInput] = React.useState('');

  return (
    <form
      className="flex flex-col gap-4 p-8 items-center justify-center w-full h-full"
      onMouseDown={async (event) => {
        if (event.currentTarget === event.target) {
          await appWindow.startDragging();
        }
      }}
      onSubmit={(event) => {
        event.preventDefault();
        roomid.set(parseInt(input, 10));
      }}
    >
      <input
        className="input input-bordered w-full"
        name="roomid"
        type="text"
        autoComplete="on"
        placeholder="Input room ID"
        autoFocus
        value={input}
        onChange={(event) => setInput(event.target.value)}
      />
      <button type="submit" className="btn btn-primary" disabled={input.length === 0}>
        Enter
      </button>
    </form>
  );
}
