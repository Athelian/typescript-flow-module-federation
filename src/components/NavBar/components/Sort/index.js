// @flow
import * as React from 'react';
import { MessageDescriptor, useIntl } from 'react-intl';
import Icon from 'components/Icon';
import { SelectInput } from 'components/Form/Inputs';
import {
  ButtonStyle,
  InputStyle,
  OptionItemStyle,
  OptionWrapperStyle,
  WrapperStyle,
} from './style';

type SortBy = { [string]: 'ASCENDING' | 'DESCENDING' };

export type SortConfig = {
  message: MessageDescriptor,
  field: string,
};

type Props = {
  sortBy: SortBy,
  onChange: SortBy => void,
  config: Array<SortConfig>,
};

const Sort = ({ sortBy, config, onChange }: Props) => {
  const intl = useIntl();
  const currentSortField = Object.entries(sortBy)[0]?.[0] ?? config[0]?.field ?? 'updatedAt';
  const currentSortDirection = Object.entries(sortBy)[0]?.[1] ?? 'DESCENDING';

  const itemToString = item => (item ? intl.formatMessage(item.message) : '');
  const itemToValue = item => (item ? item.field : '');

  const handleSortFieldChange = ({ field }) => onChange({ [field]: currentSortDirection });
  const toggleSortDirectionChange = () =>
    onChange({
      [currentSortField]: currentSortDirection === 'DESCENDING' ? 'ASCENDING' : 'DESCENDING',
    });

  return (
    <SelectInput
      name="sort"
      value={currentSortField}
      items={config}
      itemToString={itemToString}
      itemToValue={itemToValue}
      onChange={handleSortFieldChange}
      renderSelect={({ toggle, selectedItem, getInputProps, isOpen }) => {
        return (
          <div className={WrapperStyle(isOpen)}>
            <input
              readOnly
              spellCheck={false}
              className={InputStyle}
              onClick={toggle}
              {...getInputProps({
                value: itemToString(selectedItem),
              })}
            />
            <button type="button" className={ButtonStyle} onClick={toggleSortDirectionChange}>
              <Icon icon={currentSortDirection === 'ASCENDING' ? 'SORT_ASC' : 'SORT_DESC'} />
            </button>
          </div>
        );
      }}
      renderOptions={({ highlightedIndex, selectedItem, getItemProps }) => (
        <div className={OptionWrapperStyle}>
          {config.map((item, index) => (
            <div
              key={itemToValue(item)}
              className={OptionItemStyle(
                highlightedIndex === index,
                itemToValue(selectedItem) === itemToValue(item)
              )}
              {...getItemProps({ item })}
            >
              {itemToString(item)}
            </div>
          ))}
        </div>
      )}
    />
  );
};

export default Sort;
