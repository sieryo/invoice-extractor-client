import { throwNotFoundGroup } from "@/helpers/notFound";
import { deletePdfFile } from "@/lib/pdfFileStorage";
import type { PdfConfig } from "@/models/pdfConfig";
import { usePdfStore, type PdfGroup } from "@/store/usePdfStore";
import { useReverseUploadStore } from "@/store/useReverseUploadStore";

export class PdfStoreManager {
  public static getGroupById(groupId: string): PdfGroup | undefined {
    const getGroup = usePdfStore.getState().getGroup;

    return getGroup(groupId);
  }
  public static async deleteGroup(groupId: string): Promise<void> {
    const { setGroups, groups, current } = usePdfStore.getState();

    const group = this.getGroupById(groupId);

    if (!group) {
      return throwNotFoundGroup();
    }

    await Promise.all(
      group.pdfs.map((pdf) => this.deletePdfFileWrapper(pdf.id))
    );

    const newGroups = [...groups].filter((g) => g.id != group.id);

    setGroups(newGroups);

    if (group.id == current?.groupId) {
      this.clearCurrent();
    }
  }

  public static async deleteAllGroup() {
    const { groups, setGroups } = usePdfStore.getState();

    await Promise.all(
      groups.flatMap((group) => group.pdfs.map((pdf) => deletePdfFile(pdf.id)))
    );

    setGroups([]);
    this.clearCurrent();
  }

  public static async addGroupWithPdfs(files: any[], identifier: string) {
    const addGroupWithPdfs = usePdfStore.getState().addGroupWithPdfs;

    await addGroupWithPdfs(files, identifier);
  }

  public static async addPdfs(files: any[], groupId: string) {
    const isReverse = useReverseUploadStore.getState().isReverse;

    if (isReverse) files.reverse();

    await usePdfStore.getState().addPdfs(files, groupId);
  }

  public static async deletePdf(groupId: string, pdfId: string) {
    const setPdfs = usePdfStore.getState().setPdfs;

    const currentGroup = this.getGroupById(groupId);

    if (!currentGroup) {
      return throwNotFoundGroup();
    }

    await this.deletePdfFileWrapper(pdfId);

    const newPdfs = [...currentGroup.pdfs].filter((p) => p.id != pdfId);

    this.setCurrent("", "")

    setPdfs(groupId, newPdfs);
  }

  public static updateConfig(groupId: string, config: PdfConfig) {
    const updateConfig = usePdfStore.getState().updateConfig;

    return updateConfig(groupId, config);
  }

  public static async setCurrent(pdfId: string, groupId: string) {
    const setCurrent = usePdfStore.getState().setCurrent;

    setCurrent(pdfId, groupId);
  }

  static clearCurrent() {
    this.setCurrent("", "");
  }

  static async deletePdfFileWrapper(pdfId: string) {
    await deletePdfFile(pdfId);
  }
}
