export default function isSsr() {
  return typeof window === "undefined";
}
