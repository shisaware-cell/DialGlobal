import Constants from "expo-constants";

const isExpoGo = Constants.appOwnership === "expo";

class TelnyxRTCStub {
  constructor(_opts: any) {}
  connect() {}
  disconnect() {}
  on(_event: string, _handler: any) {}
  off(_event: string, _handler: any) {}
  async newCall(_opts: any): Promise<null> { return null; }
}

let TelnyxRTC: any = TelnyxRTCStub;

if (!isExpoGo) {
  try {
    TelnyxRTC = require("@telnyx/react-native-voice-sdk").TelnyxRTC;
  } catch {
    TelnyxRTC = TelnyxRTCStub;
  }
}

export type TelnyxIncomingPayload = {
  caller: string;
  number: string;
  callObj: any;
};

export type TelnyxCallStatePayload = {
  state: string;
  callObj: any | null;
  number: string;
  caller: string;
};

type InitOptions = {
  getLoginToken: () => Promise<string>;
  onClientReady?: (ready: boolean) => void;
  onIncomingCall?: (incoming: TelnyxIncomingPayload) => void;
  onCallState?: (payload: TelnyxCallStatePayload) => void;
  onError?: (error: Error) => void;
};

const TOKEN_REFRESH_MS = 55 * 60 * 1000;

class TelnyxService {
  private client: any | null = null;
  private activeCall: any | null = null;
  private incomingCall: any | null = null;
  private refreshTimer: ReturnType<typeof setInterval> | null = null;
  private options: InitOptions | null = null;
  private ready = false;

  private onReady = () => {
    this.ready = true;
    this.options?.onClientReady?.(true);
  };

  private onIncoming = (call: any) => {
    this.incomingCall = call;
    this.bindCallEvents(call);
    this.options?.onIncomingCall?.({
      caller: this.getCallerFromCall(call),
      number: this.getNumberFromCall(call),
      callObj: call,
    });
  };

  private onCallState = (event: any) => {
    const call = event?.call ?? event?.callObj ?? this.activeCall ?? this.incomingCall ?? null;
    if (call) this.activeCall = call;

    const state = String(event?.state ?? event?.call_state ?? call?.state ?? "unknown");
    const payload: TelnyxCallStatePayload = {
      state,
      callObj: call,
      number: this.getNumberFromCall(call),
      caller: this.getCallerFromCall(call),
    };

    if (["hangup", "destroy", "ended", "done", "disconnected"].includes(state.toLowerCase())) {
      this.activeCall = null;
      this.incomingCall = null;
    }

    this.options?.onCallState?.(payload);
  };

  private onClientError = (err: any) => {
    const error = err instanceof Error ? err : new Error(err?.message ?? "Telnyx client error");
    this.options?.onError?.(error);
  };

  private bindClientEvents() {
    if (!this.client) return;
    this.client.on?.("telnyx.client.ready", this.onReady);
    this.client.on?.("telnyx.call.incoming", this.onIncoming);
    this.client.on?.("telnyx.call.state", this.onCallState);
    this.client.on?.("telnyx.error", this.onClientError);
  }

  private unbindClientEvents() {
    if (!this.client) return;
    this.client.off?.("telnyx.client.ready", this.onReady);
    this.client.off?.("telnyx.call.incoming", this.onIncoming);
    this.client.off?.("telnyx.call.state", this.onCallState);
    this.client.off?.("telnyx.error", this.onClientError);
  }

  private bindCallEvents(call: any | null) {
    if (!call) return;
    call.on?.("telnyx.call.state", this.onCallState);
  }

  private getCallerFromCall(call: any | null) {
    if (!call) return "Unknown caller";
    return String(
      call?.callerName ??
      call?.caller_name ??
      call?.callerNumber ??
      call?.caller_number ??
      call?.from ??
      call?.fromNumber ??
      "Unknown caller",
    );
  }

  private getNumberFromCall(call: any | null) {
    if (!call) return "";
    return String(
      call?.callerNumber ??
      call?.caller_number ??
      call?.from ??
      call?.fromNumber ??
      call?.destinationNumber ??
      call?.destination_number ??
      call?.to ??
      "",
    );
  }

  private startTokenRefresh() {
    this.stopTokenRefresh();
    this.refreshTimer = setInterval(() => {
      this.reconnect().catch((err) => this.options?.onError?.(err));
    }, TOKEN_REFRESH_MS);
  }

  private stopTokenRefresh() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  async init(options: InitOptions) {
    this.options = options;
    await this.connect();
  }

  async connect() {
    if (!this.options) throw new Error("TelnyxService init() must be called before connect()");

    this.unbindClientEvents();
    this.client?.disconnect?.();

    const loginToken = await this.options.getLoginToken();
    if (!loginToken) throw new Error("Missing Telnyx login token");

    this.ready = false;
    this.options.onClientReady?.(false);

    this.client = new TelnyxRTC({ login_token: loginToken });
    this.bindClientEvents();
    this.client.connect?.();
    this.startTokenRefresh();
  }

  async reconnect() {
    await this.connect();
  }

  async registerPushToken(token: string, type: "fcm" | "voip") {
    if (!token) return;
    if (!this.client) await this.connect();

    const c: any = this.client;
    if (type === "voip") {
      if (typeof c?.registerVoipToken === "function") { await c.registerVoipToken(token); return; }
      if (typeof c?.registerPushToken === "function") { await c.registerPushToken({ token, type: "voip" }); return; }
      if (typeof c?.registerDeviceToken === "function") { await c.registerDeviceToken(token); return; }
      return;
    }
    if (typeof c?.registerFCMToken === "function") { await c.registerFCMToken(token); return; }
    if (typeof c?.registerPushToken === "function") { await c.registerPushToken({ token, type: "fcm" }); return; }
    if (typeof c?.registerDeviceToken === "function") { await c.registerDeviceToken(token); }
  }

  async handlePushNotification(payload: any) {
    if (!payload) return;
    if (!this.client) await this.connect();

    const c: any = this.client;
    if (typeof c?.handlePushNotification === "function") { await c.handlePushNotification(payload); return; }
    if (typeof c?.processPushNotification === "function") { await c.processPushNotification(payload); return; }
    if (typeof c?.onPushNotification === "function") { await c.onPushNotification(payload); }
  }

  disconnect() {
    this.stopTokenRefresh();
    this.unbindClientEvents();
    this.client?.disconnect?.();
    this.client = null;
    this.activeCall = null;
    this.incomingCall = null;
    this.ready = false;
    this.options?.onClientReady?.(false);
  }

  isReady() {
    return this.ready;
  }

  async makeCall(destinationNumber: string, callerIdName = "DialGlobal") {
    if (!destinationNumber) throw new Error("Destination number is required");
    if (!this.client) await this.connect();

    const call = await this.client?.newCall?.({ destinationNumber, callerIdName });
    if (!call) throw new Error("Unable to start call");

    this.activeCall = call;
    this.bindCallEvents(call);

    this.options?.onCallState?.({
      state: "calling",
      callObj: call,
      number: destinationNumber,
      caller: callerIdName,
    });

    return call;
  }

  async hangup() {
    const call = this.activeCall ?? this.incomingCall;
    await call?.hangup?.();
  }

  async answer() {
    const call = this.incomingCall ?? this.activeCall;
    if (!call) throw new Error("No incoming call to answer");
    await call.answer?.();
    this.activeCall = call;
    this.incomingCall = null;
  }

  async muteAudio() {
    const call = this.activeCall;
    if (!call) throw new Error("No active call to mute");
    if (typeof call.muteAudio === "function") { await call.muteAudio(); return; }
    if (typeof call.mute === "function") { await call.mute(); return; }
    throw new Error("Mute is not supported");
  }

  async unmuteAudio() {
    const call = this.activeCall;
    if (!call) throw new Error("No active call to unmute");
    if (typeof call.unmuteAudio === "function") { await call.unmuteAudio(); return; }
    if (typeof call.unmute === "function") { await call.unmute(); return; }
    throw new Error("Unmute is not supported");
  }

  async toggleSpeaker(enabled: boolean) {
    const call = this.activeCall ?? this.incomingCall;
    if (!call) return;
    // Try Telnyx SDK speaker toggle first
    if (typeof call.setSpeakerphone === "function") { await call.setSpeakerphone(enabled); return; }
    if (typeof call.toggleSpeaker === "function") { await call.toggleSpeaker(enabled); return; }
    // Fallback: try client-level audio routing
    const c: any = this.client;
    if (typeof c?.setSpeakerphone === "function") { await c.setSpeakerphone(enabled); return; }
    // Silently succeed — speakerphone may work automatically via OS
  }

  async hold() {
    const call = this.activeCall;
    if (!call) throw new Error("No active call to hold");
    if (typeof call.hold === "function") { await call.hold(); return; }
    throw new Error("Hold is not supported");
  }

  async unhold() {
    const call = this.activeCall;
    if (!call) throw new Error("No active call to unhold");
    if (typeof call.unhold === "function") { await call.unhold(); return; }
    if (typeof call.resume === "function") { await call.resume(); return; }
    throw new Error("Unhold is not supported");
  }

  async sendDTMF(digit: string) {
    const call = this.activeCall;
    if (!call) throw new Error("No active call for DTMF");
    if (typeof call.dtmf === "function") { await call.dtmf(digit); return; }
    if (typeof call.sendDTMF === "function") { await call.sendDTMF(digit); return; }
    if (typeof call.sendDigits === "function") { await call.sendDigits(digit); return; }
    throw new Error("DTMF is not supported");
  }
}

export const telnyxService = new TelnyxService();
