export const PDFForm = ({
    set
}: {
    set: (file: any) => void
}) => {
    const handleFileUpload = (e: any) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      console.log("testing");
      set(URL.createObjectURL(file));
    } else {
      alert("Mohon upload file PDF");
    }
  };

    return (
      <input type="file" accept="application/pdf" onChange={handleFileUpload} />
    )
}