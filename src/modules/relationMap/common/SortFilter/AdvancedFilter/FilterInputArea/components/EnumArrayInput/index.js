// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import EnumProvider from 'providers/enum';
import { NewButton } from 'components/Buttons';
import { SearchSelectInput, DefaultSearchSelect, DefaultOptions } from 'components/Form';
import { EnumArrayInputWrapperStyle, EnumInputStyle, DeleteButtonStyle } from './style';
import messages from '../messages';

type Props = {
  enumType: 'Seaport' | 'Airport' | 'Country',
};

export default function EnumArrayInput({ enumType }: Props) {
  const ifArrayLengthGreaterThanOne = true;

  return (
    <div className={EnumArrayInputWrapperStyle}>
      <div className={EnumInputStyle}>
        <EnumProvider enumType={enumType}>
          {({ loading, error, data }) => {
            if (loading) return null;
            if (error) return `Error!: ${error}`;

            return (
              <SearchSelectInput
                items={data}
                itemToString={item => (item ? item.description || item.name : '')}
                itemToValue={item => (item ? item.name : '')}
                renderSelect={({ ...rest }) => (
                  <DefaultSearchSelect
                    {...rest}
                    forceHoverStyle
                    width="200px"
                    itemToString={item => (item ? item.description || item.name : '')}
                    align="left"
                  />
                )}
                renderOptions={({ ...rest }) => (
                  <DefaultOptions
                    {...rest}
                    items={data}
                    itemToString={item => (item ? item.description || item.name : '')}
                    itemToValue={item => (item ? item.name : '')}
                    width="200px"
                    align="left"
                  />
                )}
              />
            );
          }}
        </EnumProvider>
        {
          ifArrayLengthGreaterThanOne &&
          <button className={DeleteButtonStyle} type="button">
            <Icon icon="REMOVE" />
          </button>
        }
      </div>
      <NewButton label={<FormattedMessage {...messages.add} />} />
    </div>
  );
}
