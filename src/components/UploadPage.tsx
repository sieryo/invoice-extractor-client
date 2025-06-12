import FileUploader from "./FileUploader";

export const UploadPage = ({
    onSuccessUpload
} : {
    onSuccessUpload?: () => void
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center  text-white text-[calc(10px+2vmin)]">
      <FileUploader onSuccessUpload={onSuccessUpload} />
    </div>
  );
};
