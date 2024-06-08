/**
 * Convert a file to a data url
 */
export const fileToString = (file: File): Promise<string> => {
  const reader = new FileReader();
  return new Promise<string>((resolve, reject) => {
    reader.onload = () => {
      const data = reader.result as string;
      resolve(data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Convert a data url to a file
 *
 * @privateRemarks
 * The easiest way in modern browsers to convert a data url to a blob is to fetch the data url
 */
export const stringToFile = async (data: string): Promise<File> => {
  const response = await fetch(data);
  const blob = await response.blob();
  return new File([blob], 'file');
};
