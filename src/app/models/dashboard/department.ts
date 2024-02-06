import {Count} from "@app/models/dashboard/count";

export interface Department {
  uuid: string
  name: string
  area: number
  geodata: string
  assignedBy: string
  lastModifiedBy: string
  createdAt: string
  updatedAt: string
  _count: Count
}
