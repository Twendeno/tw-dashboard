import {Meta} from "@app/models/dashboard/meta";

export interface Root<T = any> {
  statusCode: number;
  message: string;
  data: T;
  meta: Meta
}
