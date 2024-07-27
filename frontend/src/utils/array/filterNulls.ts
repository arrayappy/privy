import { MaybeUndef } from "src/types/UtilityTypes";
import isNotNull from "src/utils/isNotNull";

export default function filterNulls<T>(arr: Array<MaybeUndef<T>>): Array<T> {
  return arr.filter(isNotNull);
}
