// @flow

import * as React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import type { IntervalInput, TaskDateBinding } from 'generated/graphql';
import { findDuration } from 'utils/date';
import { ToggleInput } from 'components/Form';
import NumberInput from 'components/Inputs/NumberInput';
import DateInput from 'components/Form/Inputs/DateInput';
import SelectInput from 'components/Sheet/CellRenderer/Cell/CellInput/Common/SelectInput';
import { InputStyle } from 'components/Sheet/CellRenderer/Cell/CellInput/Common/style';
import Icon from 'components/Icon';
import messages from './messages';
import {
  WrapperStyle,
  DateWrapperStyle,
  DateInputStyle,
  IconStyle,
  LabelStyle,
  ToggleStyle,
} from './style';

type State = {|
  bindingField: string,
  type: string,
  offset: string,
  range: number,
  duration: string,
  date: string | Date,
|};

type Props = {|
  interval?: ?IntervalInput,
  binding?: ?TaskDateBinding,
  readOnly?: boolean,
  entity?: string,
  type?: string,
  date: string | Date,
  handleChange: (values: State) => void,
|};

const BINDING_FIELDS = {
  OrderIssuedAt: 'OrderIssuedAt',
  OrderDeliveryDate: 'OrderDeliveryDate',
  OrderItemOrderIssuedAt: 'OrderItemOrderIssuedAt',
  OrderItemOrderDeliveryDate: 'OrderItemOrderDeliveryDate',
  BatchDeliveredAt: 'BatchDeliveredAt',
  BatchDesiredAt: 'BatchDesiredAt',
  BatchProducedAt: 'BatchProducedAt',
  BatchExpiredAt: 'BatchExpiredAt',
  ShipmentBlDate: 'ShipmentBlDate',
  ShipmentBookingDate: 'ShipmentBookingDate',
  ShipmentCargoReady: 'ShipmentCargoReady',
  ShipmentLoadPortDeparture: 'ShipmentLoadPortDeparture',
  ShipmentFirstTransitPortArrival: 'ShipmentFirstTransitPortArrival',
  ShipmentFirstTransitPortDeparture: 'ShipmentFirstTransitPortDeparture',
  ShipmentSecondTransitPortArrival: 'ShipmentSecondTransitPortArrival',
  ShipmentSecondTransitPortDeparture: 'ShipmentSecondTransitPortDeparture',
  ShipmentDischargePortArrival: 'ShipmentDischargePortArrival',
  ShipmentCustomClearance: 'ShipmentCustomClearance',
  ShipmentWarehouseArrival: 'ShipmentWarehouseArrival',
  ShipmentDeliveryReady: 'ShipmentDeliveryReady',
  ProjectDueDate: 'ProjectDueDate',
  MilestoneDueDate: 'MilestoneDueDate',
  TaskStartDate: 'TaskStartDate',
  TaskDueDate: 'TaskDueDate',
};

const bindingOptionsByEntity = (entity: string, isStartDate: boolean) => {
  const options = {
    Order: [BINDING_FIELDS.OrderDeliveryDate, BINDING_FIELDS.OrderIssuedAt],
    Batch: [
      BINDING_FIELDS.BatchDeliveredAt,
      BINDING_FIELDS.BatchDesiredAt,
      BINDING_FIELDS.BatchProducedAt,
      BINDING_FIELDS.BatchExpiredAt,
    ],
    Shipment: [
      BINDING_FIELDS.ShipmentBlDate,
      BINDING_FIELDS.ShipmentBookingDate,
      BINDING_FIELDS.ShipmentCargoReady,
      BINDING_FIELDS.ShipmentLoadPortDeparture,
      BINDING_FIELDS.ShipmentFirstTransitPortArrival,
      BINDING_FIELDS.ShipmentFirstTransitPortDeparture,
      BINDING_FIELDS.ShipmentSecondTransitPortArrival,
      BINDING_FIELDS.ShipmentSecondTransitPortDeparture,
      BINDING_FIELDS.ShipmentDischargePortArrival,
      BINDING_FIELDS.ShipmentCustomClearance,
      BINDING_FIELDS.ShipmentWarehouseArrival,
      BINDING_FIELDS.ShipmentDeliveryReady,
    ],
  };

  return [
    isStartDate ? BINDING_FIELDS.TaskDueDate : BINDING_FIELDS.TaskStartDate,
    BINDING_FIELDS.ProjectDueDate,
    BINDING_FIELDS.MilestoneDueDate,
    ...(options?.[entity] ?? []),
  ];
};

function reducer(
  state: State,
  action: {
    // prettier-ignore
    type: | 'TOGGLE_BINDING'
      | 'CHANGE_OFFSET'
      | 'CHANGE_RANGE'
      | 'CHANGE_DURATION'
      | 'CHANGE_FIELD'
      | 'CHANGE_DATE',
    // prettier-ignore
    payload?: | {| bindingField: string |}
      | {| duration: string |}
      | {| offset: string |}
      | {| date: string |}
      | {| range: number |}
  }
) {
  const onChange = (): State => {
    console.warn({ action, state });
    return {
      ...state,
      ...action.payload,
    };
  };
  const onToggle = (): State => {
    console.warn({ action, state });
    if (state.bindingField) {
      return {
        ...state,
        bindingField: '',
      };
    }
    return {
      ...state,
      bindingField:
        state.type !== 'startDate' ? BINDING_FIELDS.TaskStartDate : BINDING_FIELDS.TaskDueDate,
    };
  };

  const handlers = {
    TOGGLE_BINDING: onToggle,
    CHANGE_OFFSET: onChange,
    CHANGE_DURATION: onChange,
    CHANGE_FIELD: onChange,
    CHANGE_RANGE: onChange,
    CHANGE_DATE: onChange,
  };

  return handlers[action.type]?.() ?? state;
}

function BaseTaskBindingInput({
  interval,
  binding,
  readOnly,
  entity,
  type,
  date,
  handleChange,
}: Props) {
  const intl = useIntl();
  const [state, dispatch] = React.useReducer(
    reducer,
    {
      bindingField: binding || '',
      type: type || 'startDate',
      offset: 'before',
      duration: 'days',
      range: 0,
      date,
    },
    (initValues: State) => {
      const { months = 0, weeks = 0, days = 0 } = interval || {};
      if ((months || weeks || days) > 0) {
        return {
          ...initValues,
          offset: 'after',
          range: months || weeks || days,
          duration: findDuration({ months, weeks }),
        };
      }
      return {
        ...initValues,
        offset: 'before',
        range: months || weeks || days,
        duration: findDuration({ months, weeks }),
      };
    }
  );

  React.useEffect(() => {
    handleChange(state);
  }, [handleChange, state]);

  if (!state.bindingField) {
    return (
      <div className={WrapperStyle(!!readOnly)}>
        <div className={DateWrapperStyle(false)}>
          <DateInput
            className={InputStyle}
            value={state.date}
            name="date"
            readOnly={readOnly}
            readOnlyWidth="100%"
            readOnlyHeight="30px"
            onChange={evt => dispatch({ type: 'CHANGE_DATE', payload: { date: evt.target.value } })}
          />
          <div className={IconStyle}>
            <Icon icon="UNBINDED" />
          </div>
        </div>
        <div className={ToggleStyle}>
          <ToggleInput
            toggled={false}
            editable={!readOnly}
            onToggle={() => {
              dispatch({
                type: 'TOGGLE_BINDING',
              });
            }}
          />
        </div>
        <div className={LabelStyle}>
          <FormattedMessage
            id="components.taskBindingInput.bindingOff"
            defaultMessage="BINDING OFF"
          />
        </div>
      </div>
    );
  }

  const itemToString = item => (item ? item.label : '');
  const itemToValue = item => (item ? item.value : '');

  return (
    <div className={WrapperStyle(!!readOnly)}>
      <div className={DateWrapperStyle(true)}>
        <DateInput
          className={DateInputStyle}
          value={state.date}
          name="date"
          readOnly
          readOnlyWidth="100%"
          readOnlyHeight="30px"
        />
        <div className={IconStyle}>
          <Icon icon="BINDED" />
        </div>
      </div>
      <div className={ToggleStyle}>
        <ToggleInput
          toggled={!!state.bindingField}
          onToggle={() => {
            dispatch({
              type: 'TOGGLE_BINDING',
            });
          }}
          editable={!readOnly}
        />
      </div>
      <div className={LabelStyle}>
        <FormattedMessage id="components.taskBindingInput.binding" defaultMessage="BINDING" />
      </div>
      <NumberInput
        name="range"
        value={state.range}
        required
        readonly={!!readOnly}
        disabled={readOnly}
        onChange={evt => dispatch({ type: 'CHANGE_RANGE', payload: { range: evt.target.value } })}
        className={InputStyle}
      />
      <SelectInput
        name="offset"
        className={InputStyle}
        itemToString={itemToString}
        itemToValue={itemToValue}
        items={[
          {
            label: 'Days',
            value: 'days',
          },
          {
            label: 'Weeks',
            value: 'weeks',
          },
          {
            label: 'Months',
            value: 'months',
          },
        ]}
        value={state.duration}
        onChange={duration => dispatch({ type: 'CHANGE_DURATION', payload: { duration } })}
        readonly={!!readOnly}
        required
      />
      <SelectInput
        className={InputStyle}
        itemToString={itemToString}
        itemToValue={itemToValue}
        items={[
          {
            label: 'Before',
            value: 'before',
          },
          { label: 'After', value: 'after' },
        ]}
        value={state.offset}
        onChange={offset => dispatch({ type: 'CHANGE_OFFSET', payload: { offset } })}
        readonly={!!readOnly}
        required
      />
      <SelectInput
        className={InputStyle}
        itemToString={itemToString}
        itemToValue={itemToValue}
        items={bindingOptionsByEntity(entity || 'Order', type === 'startDate').map(field => ({
          value: field,
          label: intl.formatMessage(messages[field]),
        }))}
        value={state.bindingField}
        onChange={(bindingField: string) =>
          dispatch({ type: 'CHANGE_FIELD', payload: { bindingField } })
        }
        readonly={!!readOnly}
        required
      />
    </div>
  );
}

export default BaseTaskBindingInput;
