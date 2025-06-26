import { handleActionWithToast } from "@/utils/withToast";
import axios from "axios";
import { BASE_API_PATH } from "./constants";

type OnUpdateCallback = () => void;

function buildFormData(file: File): FormData {
  const formData = new FormData();
  formData.append("file", file);
  return formData;
}

export const handleUpdateLawanTransaksi = async (
  file: File,
  onBeforeUpdate?: OnUpdateCallback,
  onAfterUpdate?: OnUpdateCallback
) => {
  if (onBeforeUpdate) onBeforeUpdate();

  const formData = buildFormData(file);

  try {
    await axios.post(`${BASE_API_PATH}/update-lawan-transaksi`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (err: any) {
    throw err;
  } finally {
    if (onAfterUpdate) onAfterUpdate();
  }
};

/**
 * Handler untuk file input
 */
export const handleFileUpload = async (
  e: React.ChangeEvent<HTMLInputElement>,
  onBeforeUpdate?: OnUpdateCallback,
  onAfterUpdate?: OnUpdateCallback
) => {
  const file = e.target.files?.[0];
  console.log(file);
  if (!file) return;

  await handleActionWithToast(
    () => handleUpdateLawanTransaksi(file, onBeforeUpdate, onAfterUpdate),
    {
      successMsg: "Lawan Transaksi Data Updated successfully!",
    }
  );

  e.target.value = "";
};
