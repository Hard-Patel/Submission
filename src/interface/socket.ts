import { I_ROLE_SC } from "./user";

export enum I_SOCKET_EVENTS {
  COMMAND_ACK = "command_acknowledge",
  TELE_DATA = "tele_data",
  IS_LIVE = "is_live",
}

export interface ISocketPayload {
  conf: Conf;
  data: Data;
  id: string;
  device_id: string;
  time: string;
  type: number;
}

export interface ISocketLivePayload {
  status: number;
  id: string;
}

interface Data {
  auto_control: number;
  bVolt: string;
  chgState: number;
  fenceState: number;
  fenceVolt: string;
  fence_power: number;
  siren: number;
}

interface Conf {
  fenceVolt: string;
  fence_sens: string;
  pulse_speed: string;
}
