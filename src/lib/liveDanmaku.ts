/* eslint-disable no-console */
import { inflate } from 'pako';

const heartbeat = '[object Object]';

const toUint8Array = (s: string) => {
  const codec = new TextEncoder();
  return codec.encode(s);
};

const fromUint8Array = (u8s: ArrayBuffer) => {
  const codec = new TextDecoder();
  return codec.decode(u8s);
};

type DanmakuMessage = {
  cmd: string;
  info: [string, string, string[]];
};

export type Danmaku = {
  id: string;
  user: string;
  message: string;
};

type DanmakuHandler = (danmaku: Danmaku) => void;

class LiveDanmaku {
  private ws: WebSocket | null;
  private hearbeatTimer: number;
  private handler: DanmakuHandler;

  constructor(handler: DanmakuHandler) {
    this.ws = null;
    this.hearbeatTimer = 0;
    this.handler = handler;
  }

  public open(roomid: number) {
    this.ws = new WebSocket('wss://broadcastlv.chat.bilibili.com:2245/sub');

    this.ws.addEventListener('open', () => {
      console.info('Connected');
      this.send(
        JSON.stringify({
          uid: 0,
          roomid,
          protover: 2,
          platform: 'web',
          clientver: '1.8.5',
          type: 2,
        }),
        1,
        7,
        1
      );
      this.send(heartbeat, 1, 2, 1);

      // 发送心跳包
      this.hearbeatTimer = setInterval(() => {
        this.send(heartbeat, 1, 2, 1);
      }, 30000);
    });

    this.ws.addEventListener('close', () => {
      console.info('Close');
      clearInterval(this.hearbeatTimer);
      this.hearbeatTimer = 0;
    });

    this.ws.addEventListener('error', (err) => {
      console.error('Error', err);
    });

    this.ws.addEventListener('message', (event) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(event.data as Blob);
      reader.onload = () => {
        if (reader.result) {
          this.handleData(reader.result as ArrayBuffer);
        }
      };
    });
  }

  public close() {
    this.ws?.close();
    this.ws = null;
  }

  private send(s: string, protocol: number, type: number, sn: number) {
    const u8s = toUint8Array(s);
    const buffer = new ArrayBuffer(u8s.length + 16);
    const dv = new DataView(buffer);
    //包长
    dv.setUint32(0, u8s.byteLength + 16);
    //头部长度 固定16
    dv.setUint16(4, 16);
    //协议版本号
    dv.setUint16(6, protocol);
    //协议类型
    dv.setUint32(8, type);
    //序列号 通常为1
    dv.setUint32(12, sn);

    const body = new Uint8Array(buffer);
    body.set(u8s, 16);

    this.ws?.send(body);
  }

  private handleData(data: ArrayBuffer) {
    const dv = new DataView(data);

    //包长
    const packageLen = dv.getUint32(0);
    //头部长度 固定16
    const headerLen = dv.getUint16(4);
    //协议版本号
    const protover = dv.getUint16(6);
    //协议类型
    const operation = dv.getUint32(8);
    //序列号 通常为1
    //const sequence = dv.getUint32(12);

    const body = data.slice(headerLen, packageLen);

    switch (protover) {
      case 0:
        {
          const s = fromUint8Array(body);
          const json = JSON.parse(s) as DanmakuMessage;

          if (json.cmd.startsWith('DANMU_MSG')) {
            this.handler({
              id: crypto.randomUUID(),
              user: json.info[2][1],
              message: json.info[1],
            });
          }
        }
        break;

      case 2:
        if (operation === 5) {
          const unzipped = inflate(body);
          const total = unzipped.length;
          let offset = 0;

          while (offset < total) {
            const slice = unzipped.slice(offset, total);
            offset += this.handleData(slice.buffer);
          }
        }
        break;
    }

    return packageLen;
  }
}

export default LiveDanmaku;
