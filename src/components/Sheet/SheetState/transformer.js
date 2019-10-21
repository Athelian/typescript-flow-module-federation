// @flow

export const transformField = (
  entity: Object | null,
  path: string,
  field: string,
  value: any,
  permissions: ((string) => boolean) => boolean = () => true
) => {
  if (entity === null) {
    return {
      entity: null,
      data: null,
      forbidden: false,
    };
  }

  switch (entity.__typename) {
    case 'Forbidden':
    case 'NotFound':
      return {
        entity: null,
        data: null,
        forbidden: true,
      };
    default:
      return {
        entity: {
          id: entity.id,
          type: entity.__typename,
        },
        data: {
          value,
          path,
          field,
          permissions,
          ownedBy: entity.ownedBy.id,
        },
        forbidden: false,
      };
  }
};

export const transformValueField = (
  basePath: string,
  entity: Object | null,
  field: string,
  permissions: ((string) => boolean) => boolean
) => transformField(entity, `${basePath}.${field}`, field, entity?.[field], permissions);

export const transformReadonlyField = (
  basePath: string,
  entity: Object | null,
  field: string,
  value: any
) => ({
  ...transformField(entity, `${basePath}.${field}`, field, value),
  readonly: true,
});

export const transformComputedField = (
  basePath: string,
  entity: Object | null,
  computed: Object => any
) => ({
  ...transformField(entity, basePath, '__computed__', null),
  readonly: true,
  computed,
});
