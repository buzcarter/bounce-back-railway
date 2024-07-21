// #region Convenient numerics
export type int = number;
export type integer = number;
/** unsigned 8-bit int, 0 - 256 */
export type uint8_t = number;
/** unsigned 10-bit integer, 0 - 1024 */
export type uint10_t = number;
export type unsigned_long = number;
// #endregion

// #region numbers with units
export type pixels = number;
export type milliseconds = number;
export type clockTick = number;
export type velocity = number;
export type volts = number;
// #endregion

// #region Setup for JSON data
export type Primitive = string | number | boolean;

export interface JsonData {
  [key: string]: Primitive | JsonData,
}

export interface BooleanDict {
  [key: string]: boolean,
}

export interface NumberDict {
  [key: string]: number,
}

export interface StringDict {
  [key: string]: string,
}
// #endregion
