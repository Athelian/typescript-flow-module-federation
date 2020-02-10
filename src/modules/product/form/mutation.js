// @flow
import gql from 'graphql-tag';
import {
  productFormFragment,
  userAvatarFragment,
  tagFragment,
  imageFragment,
  partnerCardFragment,
  priceFragment,
  metricFragment,
  sizeFragment,
  customFieldsFragment,
  maskFragment,
  fieldValuesFragment,
  fieldDefinitionFragment,
  productProviderFormFragment,
  documentFragment,
  badRequestFragment,
  ownedByFragment,
  milestoneCardFragment,
  projectCardFragment,
  taskCountFragment,
  taskTemplateCardFragment,
  taskWithoutParentInfoFragment,
  taskFormInTemplateFragment,
  forbiddenFragment,
  productProviderPackagingFragment,
} from 'graphql';
import {
  parseGenericField,
  parseEnumField,
  parseArrayOfIdsField,
  parseParentIdField,
  parseArrayOfChildrenField,
  parseCustomFieldsField,
  parseFilesField,
  parseTodoField,
  parseMemoField,
  parseDefaultIndexField,
  parseSizeField,
} from 'utils/data';
import { getByPathWithDefault } from 'utils/fp';

export const createProductMutation: Object = gql`
  mutation productCreate($input: ProductCreateInput!) {
    productCreate(input: $input) {
      ... on Product {
        id
      }
      ...badRequestFragment
      ...forbiddenFragment
    }
  }
  ${badRequestFragment}
  ${forbiddenFragment}
`;

export const updateProductMutation: Object = gql`
  mutation productUpdate($id: ID!, $input: ProductUpdateInput!) {
    productUpdate(id: $id, input: $input) {
      __typename
      ...productFormFragment
      ...badRequestFragment
      ...forbiddenFragment
    }
  }
  ${badRequestFragment}
  ${productFormFragment}
  ${userAvatarFragment}
  ${tagFragment}
  ${imageFragment}
  ${partnerCardFragment}
  ${priceFragment}
  ${metricFragment}
  ${sizeFragment}
  ${productProviderFormFragment}
  ${documentFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
  ${ownedByFragment}
  ${milestoneCardFragment}
  ${projectCardFragment}
  ${taskCountFragment}
  ${taskTemplateCardFragment}
  ${taskWithoutParentInfoFragment}
  ${taskFormInTemplateFragment}
  ${forbiddenFragment}
  ${productProviderPackagingFragment}
`;

export const prepareParsedProductInput = (originalValues: ?Object, newValues: Object): Object => ({
  ...parseArrayOfIdsField('followerIds', originalValues?.followers ?? [], newValues.followers),
  ...parseParentIdField(
    'importerId',
    getByPathWithDefault(null, 'importer', originalValues),
    newValues.importer
  ),
  ...parseFilesField('files', getByPathWithDefault([], 'files', originalValues), newValues.files),
  ...parseGenericField('name', getByPathWithDefault(null, 'name', originalValues), newValues.name),
  ...parseGenericField(
    'serial',
    getByPathWithDefault(null, 'serial', originalValues),
    newValues.serial
  ),
  ...parseGenericField(
    'janCode',
    getByPathWithDefault(null, 'janCode', originalValues),
    newValues.janCode
  ),
  ...parseGenericField(
    'hsCode',
    getByPathWithDefault(null, 'hsCode', originalValues),
    newValues.hsCode
  ),
  ...parseGenericField(
    'material',
    getByPathWithDefault(null, 'material', originalValues),
    newValues.material
  ),
  ...parseCustomFieldsField(
    'customFields',
    getByPathWithDefault(null, 'customFields', originalValues),
    newValues.customFields
  ),
  ...parseArrayOfIdsField(
    'tagIds',
    getByPathWithDefault([], 'tags', originalValues),
    newValues.tags
  ),
  ...parseMemoField('memo', getByPathWithDefault(null, 'memo', originalValues), newValues.memo),
  ...parseTodoField(
    getByPathWithDefault(
      { tasks: [], taskTemplate: null, milestone: null },
      'todo',
      originalValues
    ),
    newValues.todo
  ),
  ...parseArrayOfChildrenField(
    'productProviders',
    getByPathWithDefault([], 'productProviders', originalValues),
    newValues.productProviders,
    (oldProductProvider: ?Object, newProductProvider: Object) => ({
      ...(!oldProductProvider ? {} : { id: oldProductProvider.id }),
      ...parseParentIdField(
        'exporterId',
        getByPathWithDefault(null, 'exporter', oldProductProvider),
        getByPathWithDefault(null, 'exporter', newProductProvider)
      ),
      ...parseParentIdField(
        'supplierId',
        getByPathWithDefault(null, 'supplier', oldProductProvider),
        getByPathWithDefault(null, 'supplier', newProductProvider)
      ),
      ...parseGenericField(
        'name',
        getByPathWithDefault(null, 'name', oldProductProvider),
        getByPathWithDefault(null, 'name', newProductProvider)
      ),
      ...parseEnumField(
        'origin',
        getByPathWithDefault(null, 'origin', oldProductProvider),
        getByPathWithDefault(null, 'origin', newProductProvider)
      ),
      ...parseCustomFieldsField(
        'customFields',
        getByPathWithDefault(null, 'customFields', oldProductProvider),
        getByPathWithDefault(null, 'customFields', newProductProvider)
      ),
      ...parseMemoField(
        'memo',
        getByPathWithDefault(null, 'memo', oldProductProvider),
        getByPathWithDefault(null, 'memo', newProductProvider)
      ),
      ...parseGenericField(
        'unitType',
        getByPathWithDefault(null, 'unitType', oldProductProvider),
        getByPathWithDefault(null, 'unitType', newProductProvider)
      ),
      ...parseGenericField(
        'unitPrice',
        getByPathWithDefault(null, 'unitPrice', oldProductProvider),
        getByPathWithDefault(null, 'unitPrice', newProductProvider)
      ),
      ...parseGenericField(
        'unitWeight',
        getByPathWithDefault(null, 'unitWeight', oldProductProvider),
        getByPathWithDefault(null, 'unitWeight', newProductProvider)
      ),
      ...parseGenericField(
        'unitVolume',
        getByPathWithDefault(null, 'unitVolume', oldProductProvider),
        getByPathWithDefault(null, 'unitVolume', newProductProvider)
      ),
      ...parseSizeField(
        'unitSize',
        getByPathWithDefault(null, 'unitSize', oldProductProvider),
        getByPathWithDefault(null, 'unitSize', newProductProvider)
      ),
      ...parseGenericField(
        'autoCalculateUnitVolume',
        getByPathWithDefault(null, 'autoCalculateUnitVolume', oldProductProvider),
        getByPathWithDefault(null, 'autoCalculateUnitVolume', newProductProvider)
      ),
      ...parseDefaultIndexField(
        'defaultPackageIndex',
        getByPathWithDefault(null, 'defaultPackage', oldProductProvider),
        newProductProvider.defaultPackage,
        newProductProvider.packages
      ),
      ...parseArrayOfChildrenField(
        'packages',
        getByPathWithDefault([], 'packages', oldProductProvider),
        newProductProvider.packages,
        (oldPackage: ?Object, newPackage: Object) => ({
          ...(!oldPackage ? {} : { id: oldPackage.id }),
          ...parseGenericField(
            'name',
            getByPathWithDefault(null, 'name', oldPackage),
            getByPathWithDefault(null, 'name', newPackage)
          ),
          ...parseGenericField(
            'capacity',
            getByPathWithDefault(null, 'capacity', oldPackage),
            getByPathWithDefault(null, 'capacity', newPackage)
          ),
          ...parseGenericField(
            'grossWeight',
            getByPathWithDefault(null, 'grossWeight', oldPackage),
            getByPathWithDefault(null, 'grossWeight', newPackage)
          ),
          ...parseGenericField(
            'volume',
            getByPathWithDefault(null, 'volume', oldPackage),
            getByPathWithDefault(null, 'volume', newPackage)
          ),
          ...parseSizeField(
            'size',
            getByPathWithDefault(null, 'size', oldPackage),
            getByPathWithDefault(null, 'size', newPackage)
          ),
          ...parseGenericField(
            'autoCalculateVolume',
            getByPathWithDefault(null, 'autoCalculateVolume', oldPackage),
            getByPathWithDefault(null, 'autoCalculateVolume', newPackage)
          ),
        })
      ),
      ...parseFilesField(
        'files',
        getByPathWithDefault([], 'files', oldProductProvider),
        getByPathWithDefault([], 'files', newProductProvider)
      ),
      ...parseTodoField(
        getByPathWithDefault(
          { tasks: [], taskTemplate: null, milestone: null },
          'todo',
          oldProductProvider
        ),
        getByPathWithDefault(
          { tasks: [], taskTemplate: null, milestone: null },
          'todo',
          newProductProvider
        )
      ),
    })
  ),
});
