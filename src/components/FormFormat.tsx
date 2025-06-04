import { usePdfStore } from "@/store/usePdfStore";

export const FormFormat = () => {
  const { config } = usePdfStore();
  return (
    <div className=" w-full h-full">
      <div className=" flex gap-1 flex-row">
        {config && (
          <div>
            {config.sections.table.tableHeader.map((field) => (
              <div className=" text-lg">{field.name}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
