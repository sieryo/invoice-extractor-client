import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { errorMessage, successMessage } from "@/utils/message";
import { useFullScreenLoadingStore } from "@/store/useFullScreenLoadingStore";
import { BASE_API_PATH } from "@/constants/api";

export const DialogRenameFaktur = () => {
  const [files, setFiles] = useState<File[]>([]);
  const inputFileRef = useRef<HTMLInputElement>(null); // untuk reset input file


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleResetFiles = () => {
    setFiles([]);
    if (inputFileRef.current) {
      inputFileRef.current.value = "";
    }
  };

  const [folderName, setFolderName] = useState("Hasil");
  const [folderError, setFolderError] = useState("");

  const { setIsLoading } = useFullScreenLoadingStore();

  async function buildFormDataRenameFaktur(
    files: File[],
    folderName: string
  ): Promise<FormData> {
    const formData = new FormData();

    for (const file of files) {
      formData.append("files", file);
    }

    formData.append("folder_name", folderName);

    return formData;
  }

  const handleSubmit = async () => {
    if (folderError || !folderName.trim()) {
      errorMessage("Nama folder tidak valid.");
      return;
    }

    if (files.length === 0) {
      errorMessage("Silakan upload minimal 1 file PDF.");
      return;
    }
    try {
      setIsLoading(true);

      const formData = await buildFormDataRenameFaktur(files, folderName);
      const response = await axios.post(
        `${BASE_API_PATH}/rename-faktur`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      successMessage(`Berhasil di simpan!`);
      setFiles([]);
      setFolderName("Hasil");
      if (inputFileRef.current) inputFileRef.current.value = "";
    } catch (err: any) {
      if (
        err.response &&
        err.response.data instanceof Blob &&
        err.response.data.type === "application/json"
      ) {
        const reader = new FileReader();
        reader.onload = function () {
          const errorText = reader.result;
          try {
            // @ts-expect-error
            const json = JSON.parse(errorText ?? "");
            errorMessage(json.detail || "Unknown Error");
          } catch (parseError) {
            errorMessage("Error:" + errorText);
          }
        };
        reader.readAsText(err.response.data);
      } else {
        alert("err: " + (err.message || "Terjadi kesalahan"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFolderName(value);

    const illegalPattern = /[\\/:*?"<>|]/;
    if (illegalPattern.test(value)) {
      setFolderError(
        'Nama folder tidak boleh mengandung karakter: \\ / : * ? " < > |'
      );
    } else if (value.trim() === "") {
      setFolderError("Nama folder tidak boleh kosong");
    } else {
      setFolderError("");
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Rename Faktur</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white p-4 rounded-xl shadow-md">
          <DialogHeader>
            <DialogTitle>Form Rename Faktur</DialogTitle>
            <DialogDescription>
              Upload PDF dan beri nama folder output. Klik save untuk
              melanjutkan.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="folderName">Output Folder name</Label>
              <Input
                id="folderName"
                name="folderName"
                value={folderName}
                onChange={handleFolderChange}
              />
              {folderError && (
                <p className="text-sm text-red-500 mt-1">{folderError}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="files">Upload PDF(s)</Label>
              <Input
                id="files"
                type="file"
                accept="application/pdf"
                multiple
                onChange={handleFileChange}
                ref={inputFileRef}
              />
            </div>

            {files.length > 0 && (
              <div className="mt-2 border rounded-md p-3 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">File yang diupload:</h4>
                  <Button size="sm" variant="ghost" onClick={handleResetFiles}>
                    Reset
                  </Button>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                  {files.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={handleSubmit}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};
