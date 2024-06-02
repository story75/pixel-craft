/**
 * Save a file to local storage
 *
 * @remarks
 * This will encode the file as a data url and save the string to local storage.
 *
 * @param file - The file to save. If empty, the file will be removed from local storage
 * @param path - The local storage path to save the file to
 */
export const saveFile = (
  file: File | undefined,
  path: string,
): Promise<void> => {
  if (!file) {
    localStorage.removeItem(path);
    return Promise.resolve();
  }

  const reader = new FileReader();
  return new Promise<void>((resolve, reject) => {
    reader.onload = () => {
      const data = reader.result as string;
      localStorage.setItem(path, data);
      resolve();
    };
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
};

/**
 * Load a file from local storage
 *
 * @remarks
 * This will load a data url encoded file from local storage and return a File object.
 *
 * @param path - The local storage path to load the file from
 */
export const loadFile = async (path: string): Promise<File | undefined> => {
  const data = localStorage.getItem(path);
  if (!data) {
    return undefined;
  }

  // The easiest way in modern browsers to convert a data url to a blob is to fetch the data url
  const response = await fetch(data);
  const blob = await response.blob();
  return new File([blob], path);
};
