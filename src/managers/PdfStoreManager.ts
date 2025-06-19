import { NotFoundError } from "@/errors";
import { deletePdfFile } from "@/lib/pdfFileStorage";
import type { PdfConfig } from "@/models/pdfConfig";
import { usePdfStore } from "@/store/usePdfStore";
import { useReverseUploadStore } from "@/store/useReverseUploadStore";

// Add pdf file DONE
// Add group
// Upload folders
// clear currentState
// update config
// update groups (setGroups)
// update posisi (setPdfs)
export class PdfStoreManager {
  public static async deleteGroup(groupId: string): Promise<void> {
    const { setGroups, setCurrent, getGroup, groups, current } =
      usePdfStore.getState();

    const group = getGroup(groupId);

    if (!group) {
      throw new NotFoundError("Group not found.");
    }

    await Promise.all(
      group.pdfs.map((pdf) => this.deletePdfFileWrapper(pdf.id))
    );

    const newGroups = [...groups].filter((g) => g.id != group.id);

    setGroups(newGroups);

    if (group.id == current?.groupId) {
      setCurrent("", "");
    }
  }

  public static async addPdfs(files: any[], groupId: string) {
    const isReverse = useReverseUploadStore.getState().isReverse;

    if (isReverse) files.reverse();

    await usePdfStore.getState().addPdfs(files, groupId);
  }

  public static updateConfig(groudId: string, config: PdfConfig) {
    const updateConfig = usePdfStore.getState().updateConfig;

    return updateConfig(groudId, config);
  }

  public static async setCurrent(pdfId: string, groupId: string) {
    const setCurrent = usePdfStore.getState().setCurrent;

    setCurrent(pdfId, groupId);
  }

  static async deletePdfFileWrapper(pdfId: string) {
    await deletePdfFile(pdfId);
  }
}
