import {Station} from "@app/models/dashboard/station";
import {Count} from "@app/models/dashboard/count";

export interface Geometry {
  uuid: string
  type: string
  name: string
  coordinates: Station[]
  _count: Count
  color: string
  geodata: string
  reference: string
  createdAt: string
  updatedAt: string
  department_uuid: string
  town_uuid: string
  assignedBy: string
  lastModifiedBy: string
}
