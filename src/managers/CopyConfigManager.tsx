import { NotFoundError } from "@/errors";
import type { Sections } from "@/models/pdfConfig";
import { useCopyConfigStore } from "@/store/useCopyConfigStore";
import type { PdfGroup } from "@/store/usePdfStore";
import { PdfStoreManager } from "./PdfStoreManager";

export class CopyConfigManager {
  public static async copy(sections: Sections) {
    const setSections = useCopyConfigStore.getState().setSections;

    const clonedSections = structuredClone(sections);

    setSections(clonedSections);
  }

  public static async paste(group: PdfGroup) {
    const sections = useCopyConfigStore.getState().sections;

    if (!sections) {
        throw new NotFoundError("Config not found")
    }

    const newConfig = {
      ...group.config,
      sections: sections,
    };

    return PdfStoreManager.updateConfig(group.id, newConfig);
  }
}
