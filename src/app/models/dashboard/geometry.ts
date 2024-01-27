import {Station} from "@app/models/dashboard/station";
import {Count} from "@app/models/dashboard/count";

export interface Geometry {
  uuid: string
  type: string
  name: string
  coordinates: Station[]
  _count: Count
  reference: string
  createdAt: string
  updatedAt: string
  geometry_uuid: string
}
