import { SENSOR_THRESHOLD } from "../../constants";
import { uint8_t } from "../../interfaces";
import { analogRead } from "../components/IRSensor";
import { updateStdOut } from "../../simulator";

let lastStation: uint8_t = 0;

export const isAtStation = (pin: uint8_t): boolean => {
  const isAtStation = analogRead(pin) < SENSOR_THRESHOLD;
  if (isAtStation && lastStation == pin)
  {
    return false;
  }

  if (isAtStation)
  {
    lastStation = pin;
    updateStdOut({
      message: 'Arrived at station',
      pin,
    });
  }

  return isAtStation;
}
