// @flow

export const generateName = (
  {
    name,
    type,
    entityName,
  }: {
    name: string,
    type: 'exporter' | 'supplier',
    entityName: string,
  },
  previousNames: { exporter: string, supplier: string }
) => {
  switch (type) {
    case 'exporter': {
      if (name.length === 0) return entityName;

      if (name.includes(previousNames.exporter)) {
        return name.replace(previousNames.exporter, entityName);
      }
      if (name.includes(previousNames.supplier)) {
        return `${entityName}-${name}`;
      }

      return name;
    }

    case 'supplier': {
      if (name.length === 0) return entityName;

      if (name.includes(previousNames.supplier)) {
        if (name.includes(previousNames.exporter)) {
          return name.replace(`-${previousNames.supplier}`, entityName);
        }
        return name.replace(previousNames.supplier, entityName);
      }

      if (name.includes(previousNames.exporter)) {
        return `${name}-${entityName}`;
      }

      return name;
    }

    default:
      return name;
  }
};

export default generateName;
