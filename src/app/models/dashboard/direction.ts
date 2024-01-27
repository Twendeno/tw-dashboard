import {Geometry} from "@app/models/dashboard/geometry";
import {Station} from "@app/models/dashboard/station";

export interface Direction {
  uuid: string
  geometry_uuid: string
  coordinate_uuid: string
  assignedAt: string
  assignedBy: string
  geometry: Geometry
  coordinate: Station
}
