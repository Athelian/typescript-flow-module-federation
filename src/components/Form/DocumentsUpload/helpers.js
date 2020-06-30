// @flow

const iconExtensionMap = [
  {
    icon: 'ARCHIVE',
    color: 'YELLOW',
    extensions: ['7z', 'tar', 'bz2', 'gz', 'rar', 'zip', 'zipx'],
  },
  {
    icon: 'EXCEL',
    color: 'TEAL',
    extensions: [
      'csv',
      'dif',
      'ods',
      'xla',
      'xlam',
      'xls',
      'xlsb',
      'xlsm',
      'xlsx',
      'xlt',
      'xltm',
      'xltx',
      'xlw',
      'xml',
      'xps',
    ],
  },
  {
    icon: 'IMAGE',
    color: 'PURPLE',
    extensions: ['tif', 'tiff', 'png', 'gif', 'jpg', 'jpeg', 'jpe', 'bmp', 'raw', 'webp'],
  },
  {
    icon: 'PDF',
    color: 'RED',
    extensions: ['pdf', 'ps', 'eps'],
  },
  {
    icon: 'POWER_POINT',
    color: 'ORANGE',
    extensions: ['pptx', 'pptm', 'ppt', 'xps', 'ppsx', 'ppsm', 'pps', 'ppam', 'ppa'],
  },
  {
    icon: 'WORD',
    color: 'BLUE',
    extensions: ['doc', 'dot', 'wbk', 'docx', 'docm', 'dotx', 'dotm', 'docb'],
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

export const getFileExtension = (filePath: ?string): string => (filePath ?? '').split('.').pop();

export const getFileName = (filePath: ?string): string => {
  if (filePath) {
    const splitString = filePath.split('.');
    if (splitString.length > 1) {
      splitString.pop();
      const fileName = splitString.join('.');
      return fileName;
    }
  }
  return '';
};
