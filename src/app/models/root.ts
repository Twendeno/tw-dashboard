export interface Root<T = any> {
  statusCode: number;
  message: string;
  data: T;
}
