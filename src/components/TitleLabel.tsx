import { useState } from "react";
import { DialogExportedName } from "./DialogExportedName";

export const TitleLabel = ({ title }: { title: string }) => {
  const [isDialogNameActive, setIsDialogNameActive] = useState(false);

  const handleDoubleClick = () => {
    setIsDialogNameActive(true);
  };

  return (
    <div>
      <DialogExportedName
        isActive={isDialogNameActive}
        setIsActive={setIsDialogNameActive}
      />
      <div className=" p-1.5 ">
        <h1 onClick={handleDoubleClick} className=" font-bold text-xl cursor-pointer">
          {title}
        </h1>
      </div>
    </div>
  );
};
