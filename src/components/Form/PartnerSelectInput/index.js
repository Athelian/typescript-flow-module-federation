// @flow
import * as React from 'react';
import matchSorter from 'match-sorter';
import PartnerListProvider from 'providers/PartnerList';
import Label from 'components/Label';
import SearchSelectInput from 'components/Form/StyledInputs/StyledSearchSelectInput';
import { StringValue } from 'react-values';

type Props = {
  value: any,
  onChange: any => void,
  types?: Array<string>,
};

const defaultPartnerTypes = ['Exporter', 'Supplier', 'Forwarder'];
const defaultProps = {
  types: defaultPartnerTypes,
};

function PartnerSelectInput({ value, onChange, types = defaultPartnerTypes, ...rest }: Props) {
  const filterItems = (query: string, data: Array<any>) => {
    const items = data.filter(item => types.includes(item.type));
    if (!query) return items;
    return matchSorter(items, query, { keys: ['name'] });
  };

  return (
    <PartnerListProvider>
      {({ data, loading }) => (
        <StringValue defaultValue="">
          {({ value: query, set, clear }) => (
            <Label htmlFor={value} {...rest}>
              <SearchSelectInput
                value={value}
                items={filterItems(query, data)}
                onChange={item => {
                  if (!item) clear();
                  onChange(item);
                }}
                onSearch={set}
                loading={loading}
                itemToString={item => (item ? item.name : '')}
                itemToValue={item => (item ? item.id : null)}
                {...rest}
              />
            </Label>
          )}
        </StringValue>
      )}
    </PartnerListProvider>
  );
}

PartnerSelectInput.defaultProps = defaultProps;

export default PartnerSelectInput;
