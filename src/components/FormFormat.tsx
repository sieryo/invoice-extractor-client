import { useCurrentPdf } from "@/hooks/useCurrentPdf";

export const FormFormat = () => {
  const { config } = useCurrentPdf();

  if (!config) return null;
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
