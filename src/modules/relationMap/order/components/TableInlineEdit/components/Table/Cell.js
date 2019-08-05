// @flow
import React, { useContext, memo } from 'react';
// $FlowFixMe: not have flow type yet
import { areEqual } from 'react-window';
import { capitalize } from 'lodash';
import { getByPath, getByPathWithDefault, isNullOrUndefined } from 'utils/fp';
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
import { UserContext } from 'modules/user';
import {
  InlineTextInput,
  InlineNumberInput,
  InlineNumberAdjustmentInput,
  InlineDateInput,
  InlineSearchEnumInput,
  InlineInChargeInput,
  InlineTagInput,
  InlineMetricInput,
  InlineForwarderInput,
  InlineTimeLineInput,
  InlineDateTimeApprovalInput,
  InlineWarehouse,
  InlineSelectInput,
  InlineEnumInput,
  AutoCalculate,
  InlineToggleButton,
} from 'modules/relationMap/order/components/TableInlineEdit/components/TableItem/components';
import TableDisableCell from '../TableDisableCell';
import CustomFieldCell from './CustomFieldCell';
import InlineStatusButton from '../TableItem/components/InlineStatusButton';

type Props = {
  inputId: string,
  cell: string,
  name: string,
  type: string,
  meta: ?Object,
  getFieldValue: ?Function,
  getFieldName: ?Function,
  values: ?Object,
  validator: Object,
  editData: Object,
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
  user,
}: {
  id: string,
  value: any,
  type: string,
  name: string,
  values: Object,
  editData: Object,
  meta?: Object,
  hasPermission: (string | Array<string>) => boolean,
  user: Object,
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

    case 'status':
      return <InlineStatusButton {...meta} name={name} toggled={value} id={id} />;

    case 'numberAdjustment': {
      const position = Number(name.substr(-1, 1));
      const batchQuantityRevisions = getByPathWithDefault([], 'batchQuantityRevisions', values);

      if (position > batchQuantityRevisions.length) return <TableDisableCell />;

      return (
        <InlineNumberAdjustmentInput name={name} value={value} {...meta} id={id} values={values} />
      );
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

    case 'inCharges': {
      const ownId = user.organization.id;
      const importerPartnerId = getByPath('importer.partner.organization.id', values);
      const exporterPartnerId = getByPath('exporter.partner.organization.id', values);

      const groupIds = [ownId, importerPartnerId, exporterPartnerId].filter(
        item => !isNullOrUndefined(item)
      );

      return (
        <InlineInChargeInput name={name} values={value} {...meta} id={id} groupIds={groupIds} />
      );
    }

    case 'assignTo': {
      const ownId = user.organization.id;
      const shipmentId = getByPath('shipment.id', values);
      const importerPartnerId = getByPath(
        `shipments.${shipmentId}.importer.partner.organization.id`,
        editData
      );
      const exporterPartnerId = getByPath(
        `shipments.${shipmentId}.exporter.partner.organization.id`,
        values
      );

      const groupIds = [ownId, importerPartnerId, exporterPartnerId].filter(
        item => !isNullOrUndefined(item)
      );

      return (
        <InlineInChargeInput name={name} values={value} {...meta} id={id} groupIds={groupIds} />
      );
    }

    case 'forwarders':
      return <InlineForwarderInput name={name} values={values} {...meta} id={id} />;

    case 'tags': {
      const editable = {
        set:
          hasPermission(TAG_LIST) &&
          (canUpdate || hasPermission(TagsSettingPermissionMap[entityType])),
        remove: canUpdate || hasPermission(TagsSettingPermissionMap[entityType]),
      };

      return <InlineTagInput name={name} values={value} {...meta} id={id} editable={editable} />;
    }

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

function Cell(props: Props) {
  const {
    cell,
    inputId,
    name,
    type,
    meta,
    getFieldValue,
    getFieldName,
    values,
    editData,
    validator,
  } = props;
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const { user } = useContext(UserContext);
  if (!values) return null;

  if (type === 'customFields') {
    return <CustomFieldCell {...props} />;
  }

  const value = getFieldValue ? getFieldValue(values, editData) : getByPath(name, values);
  const fieldName = getFieldName ? getFieldName(values) : name;
  const cellName = `${cell}.${fieldName}`;

  return (
    <FormField key={name} name={cellName} initValue={value} validator={validator} values={values}>
      {() =>
        renderItem({
          id: inputId,
          name: cellName,
          type,
          meta,
          value,
          values,
          editData,
          hasPermission,
          user,
        })
      }
    </FormField>
  );
}

export default memo<Props>(Cell, areEqual);
