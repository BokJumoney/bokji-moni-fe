export const fileTypeMeta = {
  PDF: { label: "PDF", tone: "pdf" },
  CSV: { label: "CSV", tone: "csv" },
  XLS: { label: "XLS", tone: "sheet" },
  XLSX: { label: "XLSX", tone: "sheet" },
  HWP: { label: "HWP", tone: "doc" },
  HWPX: { label: "HWPX", tone: "doc" },
};

export const formatFileSize = (size) => {
  if (size < 1024) return `${size}B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}KB`;
  return `${(size / 1024 / 1024).toFixed(1)}MB`;
};

export const getExtension = (fileName) => {
  const extension = fileName.split(".").pop();
  return extension ? extension.toUpperCase() : "FILE";
};

export const getFileMeta = (fileName) => {
  const extension = getExtension(fileName);
  return fileTypeMeta[extension] ?? { label: extension, tone: "default" };
};