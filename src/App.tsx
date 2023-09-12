import DanmakuPage from './DanmakuPage';
import SignInPage from './SignInPage';
import roomid from './lib/roomid';

export default function App() {
  const rid = roomid.use();

  return rid === 0 ? <SignInPage /> : <DanmakuPage />;
}
