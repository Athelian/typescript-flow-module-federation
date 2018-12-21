// @flow

const mapColumnId: Function = (entity: string) => (_: any, index: number): string =>
  `${entity}-${index}`;

export { mapColumnId };

export default mapColumnId;
