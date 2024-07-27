import notify from "src/utils/toast/notify";

export default function notifyUnexpectedError(
  description?: string | JSX.Element,
  duration?: number
) {
  notify({
    description: description ?? "An unexpected error occurred",
    duration,
    message: "Unexpected error",
    type: "error",
  });
}
