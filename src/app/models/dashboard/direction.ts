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
  name: string
  departure: string
  arrival: string
  reference: string
  isOnline: boolean
  arrival_coordinate_uuid: string
  departure_coordinate_uuid: string
}
