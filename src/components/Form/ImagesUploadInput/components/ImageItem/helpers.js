// @flow

const iconExtensionMap = [
  {
    icon: 'IMAGE',
    color: 'PURPLE',
    extensions: ['tif', 'tiff', 'png', 'gif', 'jpg', 'jpeg', 'jpe', 'bmp', 'raw'],
  },
];

export const computeIcon = (fileExtension: string) => {
  const iconSearched = iconExtensionMap.find(({ extensions }) =>
    extensions.includes(fileExtension)
  );
  if (iconSearched) {
    return { icon: iconSearched.icon, color: iconSearched.color };
  }
  return { icon: 'DOCUMENT', color: 'GRAY_LIGHT' };
};

export const getFileExtension = (filePath: string): string => filePath.split('.').pop();

export const getFileName = (filePath: string): string => filePath.split('.').shift();
