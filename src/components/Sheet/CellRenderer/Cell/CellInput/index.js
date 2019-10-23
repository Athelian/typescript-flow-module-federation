// @flow
import * as React from 'react';
import { equals } from 'ramda';
import TextInput from './Inputs/TextInput';
import TextAreaInput from './Inputs/TextAreaInput';
import NumberInput from './Inputs/NumberInput';
import DateInput from './Inputs/DateInput';
import DatetimeInput from './Inputs/DatetimeInput';
import SelectCustomInput from './Inputs/SelectCustomInput';
import SelectEnumInput from './Inputs/SelectEnumInput';
import SearchSelectEnumInput from './Inputs/SearchSelectEnumInput';
import StaticMetricValueInput from './Inputs/StaticMetricValueInput';
import DocumentsInput from './Inputs/DocumentsInput';
import QuantityRevisionsInput from './Inputs/QuantityRevisionsInput';
import DateRevisionsInput from './Inputs/DateRevisionsInput';
import StatusInput from './Inputs/StatusInput';
import TagsInput from './Inputs/TagsInput';
import UserAssignmentInput from './Inputs/UserAssignmentInput';
import PortInput from './Inputs/PortInput';

type Props = {
  value: any,
  extra: any,
  type: string,
  inputFocus: boolean,
  disabled: boolean,
  onFocus: () => void,
  onBlur: () => void,
  onUp: () => void,
  onDown: () => void,
  onUpdate: any => void,
};

const inputs = {
  text: TextInput,
  textarea: TextAreaInput,
  number: NumberInput,
  static_metric_value: StaticMetricValueInput,
  date: DateInput,
  datetime: DatetimeInput,
  load_type: SelectEnumInput.LoadType,
  transport_type: SelectEnumInput.TransportType,
  incoterm: SearchSelectEnumInput.Incoterm,
  currency: SearchSelectEnumInput.Currency,
  container_type: SelectCustomInput.ContainerType,
  container_option: SelectEnumInput.ContainerOption,
  order_documents: DocumentsInput.Order,
  order_item_documents: DocumentsInput.OrderItem,
  shipment_documents: DocumentsInput.Shipment,
  quantity_revisions: QuantityRevisionsInput,
  date_revisions: DateRevisionsInput,
  status: StatusInput,
  product_tags: TagsInput.Product,
  order_tags: TagsInput.Order,
  order_item_tags: TagsInput.OrderItem,
  batch_tags: TagsInput.Batch,
  shipment_tags: TagsInput.Shipment,
  container_tags: TagsInput.Container,
  user_tags: TagsInput.User,
  task_tags: TagsInput.Task,
  project_tags: TagsInput.Project,
  user_assignment: UserAssignmentInput,
  port: PortInput,
};

const CellInput = ({
  value,
  extra,
  type,
  inputFocus,
  disabled,
  onFocus,
  onBlur,
  onUp,
  onDown,
  onUpdate,
}: Props) => {
  const [dirtyValue, setDirtyValue] = React.useState<any>(value);

  React.useEffect(() => {
    setDirtyValue(value);
  }, [value, setDirtyValue]);

  const handleChange = newValue => {
    if (!equals(newValue, dirtyValue)) {
      setDirtyValue(newValue);

      if (!inputFocus) {
        onUpdate(newValue);
      }
    }
  };

  const handleBlur = () => {
    onBlur();

    if (equals(dirtyValue, value)) {
      return;
    }

    onUpdate(dirtyValue);
  };

  const handleKeyDown = (e: SyntheticKeyboardEvent<HTMLElement>) => {
    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowRight':
      case 'ArrowLeft':
        e.stopPropagation();
        break;
      case 'Tab':
        onBlur();
        break;
      case 'Enter':
        e.stopPropagation();
        onBlur();

        if (e.shiftKey) {
          onUp();
        } else {
          onDown();
        }
        break;
      default:
        break;
    }
  };

  if (!inputs[type]) {
    throw new Error(`Cell input type of '${type}' doesn't not exist`);
  }

  return (
    <div>
      {React.createElement(inputs[type], {
        value: dirtyValue,
        extra,
        readonly: disabled,
        focus: inputFocus,
        onFocus,
        onBlur: handleBlur,
        onChange: handleChange,
        onKeyDown: handleKeyDown,
      })}
    </div>
  );
};

export default CellInput;
