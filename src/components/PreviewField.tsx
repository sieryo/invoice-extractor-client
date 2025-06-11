export const PreviewField = ({
  data,
  label = "Configured",
  isMultiword = false,
}: {
  data: any;
  label?: string;
  isMultiword?: boolean;
}) => {
  return (
    <div className="mt-4 justify-between flex rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-700 shadow-sm">
      <div>
        <p className="font-medium text-gray-600">{label}:</p>
        <p className="text-gray-800">{data ?? "No data"}</p>
      </div>
      {isMultiword && (
        <div>
          <p className="font-medium text-blue-400">Multiword</p>
        </div>
      )}
    </div>
  );
};
