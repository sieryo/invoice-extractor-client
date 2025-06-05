export const PreviewField = ({ data }: { data: any }) => {
  return (
    <div className="mt-4 rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-700 shadow-sm">
      <p className="font-medium text-gray-600">Preview:</p>
      <p className="text-gray-800">{data ?? "No data"}</p>
    </div>
  );
};
