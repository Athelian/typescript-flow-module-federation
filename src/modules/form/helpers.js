// @flow
import * as React from 'react';
import { StringValue } from 'react-values';
import matchSorter from 'match-sorter';
import EnumProvider from 'providers/enum';
import FormattedDate from 'components/FormattedDate';
import {
  FieldItem,
  Label,
  Tooltip,
  DefaultStyle,
  TextInput,
  DateInput,
  NumberInput,
  SearchSelectInput,
  DefaultSearchSelect,
  DefaultOptions,
  DefaultPriceStyle,
} from 'components/Form';
import logger from 'utils/logger';

const filterItems = (query: string, items: Array<any>) => {
  if (!query) return items;
  return matchSorter(items, query, {
    keys: ['name', 'description'],
  });
};

export function textInputFactory({
  required = false,
  width = '200px',
  height = '30px',
  isNew,
  label,
  name,
  inputHandlers,
  initValue,
}: {
  required?: boolean,
  width?: string,
  height?: string,
  isNew: boolean,
  label?: React.Node,
  name: string,
  inputHandlers: Object,
  initValue: any,
}) {
  return (
    <FieldItem
      label={
        <Label required={required} width={width}>
          {label}
        </Label>
      }
      tooltip={
        <Tooltip
          isNew={isNew}
          errorMessage={inputHandlers.isTouched && inputHandlers.errorMessage}
          changedValues={{
            oldValue: initValue,
            newValue: inputHandlers.value,
          }}
        />
      }
      input={
        <DefaultStyle
          isFocused={inputHandlers.isFocused}
          hasError={inputHandlers.isTouched && inputHandlers.errorMessage}
          forceHoverStyle={isNew}
          width={width}
          height={height}
        >
          <TextInput name={name} {...inputHandlers} />
        </DefaultStyle>
      }
    />
  );
}

export function dateInputFactory({
  required = false,
  width = '200px',
  height = '30px',
  isNew,
  label,
  name,
  inputHandlers,
  initValue,
}: {
  required?: boolean,
  width?: string,
  height?: string,
  isNew: boolean,
  label?: React.Node,
  name: string,
  inputHandlers: Object,
  initValue: any,
}) {
  return (
    <FieldItem
      label={
        <Label required={required} width={width}>
          {label}
        </Label>
      }
      tooltip={
        <Tooltip
          isNew={isNew}
          errorMessage={inputHandlers.isTouched && inputHandlers.errorMessage}
          changedValues={{
            oldValue: initValue ? <FormattedDate value={initValue} /> : initValue,
            newValue: inputHandlers.value ? (
              <FormattedDate value={inputHandlers.value} />
            ) : (
              inputHandlers.value
            ),
          }}
        />
      }
      input={
        <DefaultStyle
          type="date"
          isFocused={inputHandlers.isFocused}
          hasError={inputHandlers.isTouched && inputHandlers.errorMessage}
          forceHoverStyle={isNew}
          width={width}
          height={height}
        >
          <DateInput name={name} {...inputHandlers} />
        </DefaultStyle>
      }
    />
  );
}

export function numberInputFactory({
  required = false,
  width = '200px',
  height = '30px',
  isNew,
  label,
  name,
  inputHandlers,
  initValue,
}: {
  required?: boolean,
  width?: string,
  height?: string,
  isNew: boolean,
  label?: React.Node,
  name: string,
  inputHandlers: Object,
  initValue: any,
}) {
  return (
    <FieldItem
      label={label && <Label required={required}>{label}</Label>}
      tooltip={
        <Tooltip
          isNew={isNew}
          errorMessage={inputHandlers.isTouched && inputHandlers.errorMessage}
          changedValues={{
            oldValue: initValue,
            newValue: inputHandlers.value,
          }}
        />
      }
      input={
        <DefaultStyle
          isFocused={inputHandlers.isFocused}
          hasError={inputHandlers.isTouched && inputHandlers.errorMessage}
          forceHoverStyle={isNew}
          width={width}
          height={height}
        >
          <NumberInput name={name} {...inputHandlers} />
        </DefaultStyle>
      }
    />
  );
}

export function priceInputFactory({
  required = false,
  width = '200px',
  height = '30px',
  currency,
  isNew,
  label,
  name,
  inputHandlers,
  initValue,
}: {
  required?: boolean,
  width?: string,
  height?: string,
  currency: string,
  isNew: boolean,
  label?: React.Node,
  name: string,
  inputHandlers: Object,
  initValue: any,
}) {
  return (
    <FieldItem
      label={label && <Label required={required}>{label}</Label>}
      tooltip={
        <Tooltip
          isNew={isNew}
          errorMessage={inputHandlers.isTouched && inputHandlers.errorMessage}
          changedValues={{
            oldValue: initValue,
            newValue: inputHandlers.value,
          }}
        />
      }
      input={
        <DefaultPriceStyle
          currency={currency}
          isFocused={inputHandlers.isFocused}
          hasError={inputHandlers.isTouched && inputHandlers.errorMessage}
          forceHoverStyle={isNew}
          width={width}
          height={height}
        >
          <NumberInput name={name} {...inputHandlers} />
        </DefaultPriceStyle>
      }
    />
  );
}

export function selectSearchEnumInputFactory({
  required = false,
  width = '200px',
  enumType,
  inputHandlers,
  name,
  isNew,
  label,
  initValue,
}: {
  enumType: string,
  required?: boolean,
  width?: string,
  isNew: boolean,
  label?: React.Node,
  name: string,
  inputHandlers: Object,
  initValue: any,
}) {
  return (
    <FieldItem
      label={
        <Label required={required} width={width}>
          {label}
        </Label>
      }
      tooltip={
        <Tooltip
          isNew={isNew}
          errorMessage={inputHandlers.isTouched && inputHandlers.errorMessage}
          changedValues={{
            oldValue: initValue,
            newValue: inputHandlers.value,
          }}
        />
      }
      input={
        <EnumProvider enumType={enumType}>
          {({ loading, error, data }) => {
            if (loading) return null;
            if (error) return `Error!: ${error}`;
            return (
              <StringValue
                defaultValue={inputHandlers.value}
                onChange={newValue =>
                  inputHandlers.onChange({
                    target: {
                      value: newValue || '',
                    },
                  })
                }
              >
                {({ value: query, set, clear }) => (
                  <SearchSelectInput
                    name={name}
                    {...inputHandlers}
                    items={filterItems(query, data)}
                    itemToString={item => (item ? item.name : '')}
                    itemToValue={item => (item ? item.name : '')}
                    renderSelect={({ ...rest }) => (
                      <DefaultSearchSelect
                        {...rest}
                        hasError={inputHandlers.isTouched && inputHandlers.errorMessage}
                        forceHoverStyle={isNew}
                        width={width}
                        isOpen={inputHandlers.isFocused}
                      />
                    )}
                    renderOptions={({ ...rest }) => (
                      <DefaultOptions
                        {...rest}
                        items={filterItems(query, data)}
                        itemToString={item => (item ? item.name : '')}
                        itemToValue={item => (item ? item.name : '')}
                        width={width}
                      />
                    )}
                    onChange={item => {
                      logger.warn('SearchSelectInput onChange', item);
                      if (!item) clear();
                      set(item && item.name);
                    }}
                    onSearch={set}
                  />
                )}
              </StringValue>
            );
          }}
        </EnumProvider>
      }
    />
  );
}
