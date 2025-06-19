import { successMessage, errorMessage } from "@/utils/message";
import { toast } from "sonner";

export async function handleActionWithToast(
  action: () => Promise<void>,
  {
    successMsg,
    errorMap,
    fallbackError = "Unexpected error",
  }: {
    successMsg?: string;
    errorMap?: Map<Function, string>; // error class to message
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
    toast.error(fallbackError);
  }
}
