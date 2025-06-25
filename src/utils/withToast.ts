import { successMessage, errorMessage } from "@/utils/message";

export async function handleActionWithToast(
  action: () => Promise<void>,
  {
    successMsg,
    errorMap,
    fallbackError = "Unexpected error",
  }: {
    successMsg?: string;
    errorMap?: Map<Function, string>;
    fallbackError?: string;
  }
) {
  try {
    await action();
    if (successMsg) successMessage(successMsg);
  } catch (err: any) {
    if (errorMap) {
      for (const [ErrorClass, msg] of errorMap) {
        if (err instanceof ErrorClass) {
          errorMessage(msg);
          return;
        }
      }
    }

    if (err?.response) {
      const res = err.response;

      if (res.data instanceof Blob && res.data.type === "application/json") {
        const reader = new FileReader();
        reader.onload = function () {
          try {
            const json = JSON.parse(reader.result as string);
            errorMessage(json?.detail || fallbackError);
          } catch {
            errorMessage(fallbackError);
          }
        };
        reader.readAsText(res.data);
        return;
      }

      if (res.data?.detail || res.data?.message) {
        errorMessage(res.data.detail || res.data.message);
        return;
      }
    }

    errorMessage(fallbackError);
  }
}
