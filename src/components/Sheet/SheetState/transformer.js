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

export const transformCustomField = (
  basePath: string,
  entity: Object | null,
  fieldDefinitionId: string,
  permissions: ((string) => boolean) => boolean
) =>
  transformField(
    entity,
    basePath,
    `@${fieldDefinitionId}`,
    (entity?.customFields?.fieldValues ?? []).find(
      fv => fv.fieldDefinition.id === fieldDefinitionId
    )?.value?.string ?? null,
    permissions
  );

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
  field: string,
  computed: Object => any
) => ({
  ...transformField(entity, basePath, field, null),
  readonly: true,
  computed,
});
