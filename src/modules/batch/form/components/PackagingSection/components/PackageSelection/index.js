// @flow
import * as React from 'react';
import type { ProductProviderPackagePayload } from 'generated/graphql';
import { injectIntl, type IntlShape } from 'react-intl';
import { getByPath } from 'utils/fp';
import logger from 'utils/logger';
import { useTextInput } from 'modules/form/hooks';
import Icon from 'components/Icon';
import { FieldItem, SelectInput, DefaultSelect, DefaultOptions } from 'components/Form';
import { ApplyButton } from 'components/Buttons';
import { WrapperStyle, DefaultOptionStyle } from './style';

type Props = {|
  intl: IntlShape,
  items: Array<ProductProviderPackagePayload>,
  defaultPackaging: ProductProviderPackagePayload,
  onApply: (pkgId: string) => void,
|};

function renderOptionValue({
  items,
  item,
  intl,
  defaultPackaging,
}: {|
  defaultPackaging: ProductProviderPackagePayload,
  items: Array<ProductProviderPackagePayload>,
  intl: IntlShape,
  item: { label: string, value: string },
|}) {
  const pkg = items.find(currentPkg => getByPath('id', currentPkg) === getByPath('value', item));
  const isDefault = getByPath('id', defaultPackaging) === getByPath('id', pkg);
  return (
    <div>
      <span className={DefaultOptionStyle(isDefault)}>
        <Icon icon="STAR" />
      </span>
      {item
        ? item.label ||
          intl.formatMessage({
            id: 'modules.ProductProviders.noPackageName',
            defaultMessage: 'No package name',
          })
        : ''}
    </div>
  );
}

function PackageSelection({ intl, items, defaultPackaging, onApply }: Props) {
  const selectItems = items.map(item => ({
    label: getByPath('name', item),
    value: getByPath('id', item),
  }));
  const { hasError, isFocused, ...inputHandlers } = useTextInput(
    getByPath('id', defaultPackaging),
    {
      isRequired: true,
    }
  );
  return (
    <div className={WrapperStyle}>
      <FieldItem
        input={
          <SelectInput
            {...inputHandlers}
            name="defaultPackaging"
            items={selectItems}
            itemToString={item =>
              item
                ? item.label ||
                  intl.formatMessage({
                    id: 'modules.ProductProviders.noPackageName',
                    defaultMessage: 'No package name',
                  })
                : ''
            }
            itemToValue={item => (item ? item.value : '')}
            inputValue={inputHandlers.value}
            renderSelect={({ ...selectProps }) => (
              <DefaultSelect
                {...selectProps}
                hideClearIcon
                hasError={hasError}
                itemToString={item =>
                  item
                    ? item.label ||
                      intl.formatMessage({
                        id: 'modules.ProductProviders.noPackageName',
                        defaultMessage: 'No package name',
                      })
                    : ''
                }
                itemToValue={item => (item ? item.value : '')}
                isOpen={isFocused}
                width="200px"
                align="left"
              />
            )}
            renderOptions={({ ...optionProps }) => (
              <DefaultOptions
                {...optionProps}
                itemToString={item => renderOptionValue({ intl, item, items, defaultPackaging })}
                itemToValue={item => (item ? item.value : '')}
                items={selectItems}
                width="200px"
                align="left"
              />
            )}
            onChange={(item: ?{ value: string }) => {
              logger.warn('SelectInput onChange', item);
              inputHandlers.onChange({
                currentTarget: {
                  value: item && item.value,
                },
              });
            }}
            onBlur={() => {
              logger.warn('SelectInput onBlur', inputHandlers.value);
            }}
          />
        }
      />
      <ApplyButton onClick={() => onApply(inputHandlers.value)} />
    </div>
  );
}

export default injectIntl(PackageSelection);
