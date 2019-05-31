// @flow
import * as React from 'react';
import { capitalize } from 'lodash';
import { getByPath, getByPathWithDefault } from 'utils/fp';
import { FormField } from 'modules/form';
import { ORDER_UPDATE, ORDER_SET_TAGS } from 'modules/permission/constants/order';
import { ORDER_ITEMS_UPDATE } from 'modules/permission/constants/orderItem';
import { BATCH_UPDATE, BATCH_SET_TAGS } from 'modules/permission/constants/batch';
import { SHIPMENT_UPDATE, SHIPMENT_SET_TAGS } from 'modules/permission/constants/shipment';
import { CONTAINER_UPDATE, CONTAINER_SET_TAGS } from 'modules/permission/constants/container';
import { PRODUCT_UPDATE, PRODUCT_PROVIDER_UPDATE } from 'modules/permission/constants/product';
import { TAG_LIST } from 'modules/permission/constants/tag';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import TableDisableCell from '../TableDisableCell';
import { WrapperStyle, ItemStyle } from './style';
import {
  InlineTextInput,
  InlineNumberInput,
  InlineNumberAdjustmentInput,
  InlineDateInput,
  InlineSearchEnumInput,
  InlineInChargeInput,
  InlineTagInput,
  InlineProductProvider,
  InlineMetricInput,
  InlineForwarderInput,
  InlineTimeLineInput,
  InlineDateTimeApprovalInput,
  InlineWarehouse,
  InlineSelectInput,
  InlineEnumInput,
  AutoCalculate,
  InlineToggleButton,
} from './components';

type OptionalProps = {
  columnNo: number,
};
type Props = OptionalProps & {
  cell: string,
  rowNo: number,
  fields: Array<{
    name: string,
    type: string,
    meta?: Object,
    getFieldValue?: Function,
    getFieldName?: Function,
  }>,
  values: ?Object,
  validator: Object,
  editData: Object,
};

const defaultProps = {
  columnNo: 0,
};

const UpdatePermissionMap = {
  Order: ORDER_UPDATE,
  OrderItem: ORDER_ITEMS_UPDATE,
  Batch: BATCH_UPDATE,
  Shipment: SHIPMENT_UPDATE,
  Container: CONTAINER_UPDATE,
  Product: PRODUCT_UPDATE,
  ProductProvider: PRODUCT_PROVIDER_UPDATE,
};

const TagsSettingPermissionMap = {
  Order: ORDER_SET_TAGS,
  Batch: BATCH_SET_TAGS,
  Shipment: SHIPMENT_SET_TAGS,
  Container: CONTAINER_SET_TAGS,
};

function renderItem({
  id,
  type,
  value,
  name,
  meta,
  values,
  editData,
  hasPermission,
}: {
  id: string,
  value: any,
  type: string,
  name: string,
  values: Object,
  editData: Object,
  meta?: Object,
  hasPermission: (string | Array<string>) => boolean,
}) {
  const { __typename: entityType } = values;
  const canUpdate = hasPermission(UpdatePermissionMap[entityType]);

  switch (type) {
    case 'number':
      return <InlineNumberInput name={name} value={value} {...meta} id={id} />;

    case 'calculate':
      return <AutoCalculate values={values} editData={editData} {...meta} id={id} />;

    case 'toggle':
      return <InlineToggleButton name={name} toggled={value} id={id} />;

    case 'numberAdjustment': {
      const position = Number(name.substr(-1, 1));
      const batchQuantityRevisions = getByPathWithDefault([], 'batchQuantityRevisions', values);

      if (position > batchQuantityRevisions.length) return <TableDisableCell />;

      return <InlineNumberAdjustmentInput name={name} value={value} {...meta} id={id} />;
    }

    case 'date':
      return <InlineDateInput name={name} value={value} {...meta} id={id} />;

    case 'timeline': {
      if (!value) return <TableDisableCell />;
      return <InlineTimeLineInput name={name} value={value} {...meta} id={id} />;
    }

    case 'datetimeWithApproval': {
      return <InlineDateTimeApprovalInput name={name} value={value} {...meta} id={id} />;
    }

    case 'metric':
      return <InlineMetricInput name={name} value={value} values={values} {...meta} id={id} />;

    case 'select':
      return <InlineSelectInput name={name} value={value} {...meta} id={id} />;

    case 'enum':
      return <InlineSearchEnumInput name={name} value={value} {...meta} id={id} />;

    case 'enumSelect':
      return <InlineEnumInput name={name} value={value} {...meta} id={id} />;

    case 'inCharges':
      return <InlineInChargeInput name={name} values={value} {...meta} id={id} />;

    case 'forwarders':
      return <InlineForwarderInput name={name} values={values} {...meta} id={id} />;

    case 'tags': {
      const editable = {
        set:
          hasPermission(TAG_LIST) &&
          (canUpdate || hasPermission(TagsSettingPermissionMap[entityType])),
        remove:
          hasPermission(TAG_LIST) &&
          (canUpdate || hasPermission(TagsSettingPermissionMap[entityType])),
      };

      return <InlineTagInput name={name} values={value} {...meta} id={id} editable={editable} />;
    }

    case 'productProvider':
      return (
        <InlineProductProvider
          name={name}
          value={value}
          exporter={value.exporter.id}
          {...meta}
          id={id}
        />
      );

    case 'warehouse': {
      if (getByPath('disableIfContainersExist', meta)) {
        const numOfContainers = getByPathWithDefault([], 'containers', values).length;
        if (numOfContainers > 0) {
          return <TableDisableCell />;
        }
      }
      return <InlineWarehouse name={name} value={value} {...meta} id={id} />;
    }

    case 'port': {
      const voyages = getByPathWithDefault([], 'voyages', values);
      const isFirstTransitPort = getByPath('isFirstTransitPort', meta);
      const isSecondTransitPort = getByPath('isSecondTransitPort', meta);
      if (isFirstTransitPort && voyages.length < 2) {
        return <TableDisableCell />;
      }
      if (isSecondTransitPort && voyages.length < 3) {
        return <TableDisableCell />;
      }

      const transportType = getByPath('transportType', values);
      if (!transportType) {
        return (
          <InlineTextInput
            name={name}
            value="Transport Type not selected"
            {...meta}
            id={id}
            disabled
          />
        );
      }

      const nameSplit = name.split('.');
      const portType = nameSplit[nameSplit.length - 1];

      return (
        <InlineSearchEnumInput
          name={name}
          value={value}
          {...meta}
          id={id}
          enumType={capitalize(portType)}
        />
      );
    }

    default:
      return <InlineTextInput name={name} value={value} {...meta} id={id} />;
  }
}

function TableItem({ cell, fields, values, editData, validator, rowNo, columnNo }: Props) {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);

  if (!values) return null;

  return (
    <div className={WrapperStyle}>
      {fields.map(({ name, type, meta, getFieldValue, getFieldName }, fieldCounter) => {
        const value = getFieldValue ? getFieldValue(values, editData) : getByPath(name, values);
        const fieldName = getFieldName ? getFieldName(values) : name;
        const cellName = `${cell}.${fieldName}`;
        const id = `${rowNo}-${fieldCounter + columnNo + 1}`;
        return (
          <div className={ItemStyle} key={name}>
            <FormField name={cellName} initValue={value} validator={validator} values={values}>
              {() =>
                renderItem({
                  id,
                  name: cellName,
                  type,
                  meta,
                  value,
                  values,
                  editData,
                  hasPermission,
                })
              }
            </FormField>
          </div>
        );
      })}
    </div>
  );
}

TableItem.defaultProps = defaultProps;

export default TableItem;
