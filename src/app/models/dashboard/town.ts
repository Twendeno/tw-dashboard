import {Count} from "@app/models/dashboard/count";

export interface Town {
  uuid: string
  name: string
  area: number
  geodata: string
  coordinate_uuid: string
  department_uuid: string
  assignedBy: string
  lastModifiedBy: string
  createdAt: string
  updatedAt: string
  geometry: any[]
  districts: any[]
  _count: Count
}
