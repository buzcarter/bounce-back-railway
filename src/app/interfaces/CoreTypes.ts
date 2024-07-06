export type integer = number;

export type int = number;

/** unsigned 10-bit integer, 0 - 1024 */
export type unsignedTiny = number;

export type pixels = number;

export type milliseconds = number;

export type clockTick = number;

export type velocity = number;

export type Primitive = string | number | boolean;

export interface JsonData {
  [key: string]: Primitive | JsonData
}

export interface BooleanDict {
  [key: string]: boolean
}

export interface NumberDict {
  [key: string]: number
}

export interface StringDict {
  [key: string]: string
}
