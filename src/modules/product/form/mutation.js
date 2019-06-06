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
  taskTemplateCardFragment,
  taskFormInSlideViewFragment,
  taskFormInTemplateFragment,
  forbiddenFragment,
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
  ${taskTemplateCardFragment}
  ${taskFormInSlideViewFragment}
  ${taskFormInTemplateFragment}
  ${forbiddenFragment}
`;

export const prepareParsedProductInput = (originalValues: ?Object, newValues: Object): Object => ({
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
    getByPathWithDefault({ tasks: [], taskTemplate: null }, 'todo', originalValues),
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
        newProductProvider.exporter
      ),
      ...parseParentIdField(
        'supplierId',
        getByPathWithDefault(null, 'supplier', oldProductProvider),
        newProductProvider.supplier
      ),
      ...parseGenericField(
        'name',
        getByPathWithDefault(null, 'name', oldProductProvider),
        newProductProvider.name
      ),
      ...parseEnumField(
        'origin',
        getByPathWithDefault(null, 'origin', oldProductProvider),
        newProductProvider.origin
      ),
      ...parseGenericField(
        'productionLeadTime',
        getByPathWithDefault(null, 'productionLeadTime', oldProductProvider),
        newProductProvider.productionLeadTime
      ),
      ...parseGenericField(
        'inspectionFee',
        getByPathWithDefault(null, 'inspectionFee', oldProductProvider),
        newProductProvider.inspectionFee
      ),
      ...parseCustomFieldsField(
        'customFields',
        getByPathWithDefault(null, 'customFields', oldProductProvider),
        newProductProvider.customFields
      ),
      ...parseMemoField(
        'memo',
        getByPathWithDefault(null, 'memo', oldProductProvider),
        newProductProvider.memo
      ),
      ...parseGenericField(
        'unitType',
        getByPathWithDefault(null, 'unitType', oldProductProvider),
        newProductProvider.unitType
      ),
      ...parseGenericField(
        'unitPrice',
        getByPathWithDefault(null, 'unitPrice', oldProductProvider),
        newProductProvider.unitPrice
      ),
      ...parseGenericField(
        'unitWeight',
        getByPathWithDefault(null, 'unitWeight', oldProductProvider),
        newProductProvider.unitWeight
      ),
      ...parseGenericField(
        'unitVolume',
        getByPathWithDefault(null, 'unitVolume', oldProductProvider),
        newProductProvider.unitVolume
      ),
      ...parseGenericField(
        'unitSize',
        getByPathWithDefault(null, 'unitSize', oldProductProvider),
        newProductProvider.unitSize
      ),
      ...parseGenericField(
        'packageName',
        getByPathWithDefault(null, 'packageName', oldProductProvider),
        newProductProvider.packageName
      ),
      ...parseGenericField(
        'packageCapacity',
        getByPathWithDefault(null, 'packageCapacity', oldProductProvider),
        newProductProvider.packageCapacity
      ),
      ...parseGenericField(
        'packageGrossWeight',
        getByPathWithDefault(null, 'packageGrossWeight', oldProductProvider),
        newProductProvider.packageGrossWeight
      ),
      ...parseGenericField(
        'packageVolume',
        getByPathWithDefault(null, 'packageVolume', oldProductProvider),
        newProductProvider.packageVolume
      ),
      ...parseGenericField(
        'packageSize',
        getByPathWithDefault(null, 'packageSize', oldProductProvider),
        newProductProvider.packageSize
      ),
      ...parseGenericField(
        'autoCalculatePackageVolume',
        getByPathWithDefault(null, 'autoCalculatePackageVolume', oldProductProvider),
        newProductProvider.autoCalculatePackageVolume
      ),
      ...parseGenericField(
        'autoCalculateUnitVolume',
        getByPathWithDefault(null, 'autoCalculateUnitVolume', oldProductProvider),
        newProductProvider.autoCalculateUnitVolume
      ),
      ...parseFilesField(
        'files',
        getByPathWithDefault([], 'files', oldProductProvider),
        newProductProvider.files
      ),
      ...parseTodoField(
        getByPathWithDefault({ tasks: [], taskTemplate: null }, 'todo', oldProductProvider),
        newProductProvider.todo
      ),
    })
  ),
});
