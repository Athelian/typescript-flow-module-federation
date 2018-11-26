// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import EnumProvider from 'providers/enum';
import { NewButton } from 'components/Buttons';
import {
  FieldItem,
  Label,
  SearchSelectInput,
  DefaultSearchSelect,
  DefaultOptions,
} from 'components/Form';
import {
  PortsWrapperStyle,
  PortInputsWrapperStyle,
  PortInputStyle,
  DeleteButtonStyle,
} from './style';
import messages from '../messages';

type Props = {
  portType: 'Seaport' | 'Airport',
};

export default function Ports({ portType }: Props) {
  return (
    <div className={PortsWrapperStyle}>
      <FieldItem
        vertical
        label={
          <Label>
            <FormattedMessage {...messages.loadPort} />
          </Label>
        }
        input={
          <div className={PortInputsWrapperStyle}>
            <div className={PortInputStyle}>
              <EnumProvider enumType={portType}>
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
              {/* Do not allow delete if there is only one input */}
              <button className={DeleteButtonStyle} type="button">
                <Icon icon="REMOVE" />
              </button>
            </div>
            {/* Adds new input */}
            <NewButton label={<FormattedMessage {...messages.addPort} />} />
          </div>
        }
      />

      <FieldItem
        vertical
        label={
          <Label>
            <FormattedMessage {...messages.dischargePort} />
          </Label>
        }
        input={
          <div className={PortInputsWrapperStyle}>
            <div className={PortInputStyle}>
              <EnumProvider enumType={portType}>
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
              {/* Do not allow delete if there is only one input */}
              <button className={DeleteButtonStyle} type="button">
                <Icon icon="REMOVE" />
              </button>
            </div>
            {/* Adds new input */}
            <NewButton label={<FormattedMessage {...messages.addPort} />} />
          </div>
        }
      />

      <FieldItem
        vertical
        label={
          <Label>
            <FormattedMessage {...messages.firstTransitPort} />
          </Label>
        }
        input={
          <div className={PortInputsWrapperStyle}>
            <div className={PortInputStyle}>
              <EnumProvider enumType={portType}>
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
              {/* Do not allow delete if there is only one input */}
              <button className={DeleteButtonStyle} type="button">
                <Icon icon="REMOVE" />
              </button>
            </div>
            {/* Adds new input */}
            <NewButton label={<FormattedMessage {...messages.addPort} />} />
          </div>
        }
      />

      <FieldItem
        vertical
        label={
          <Label>
            <FormattedMessage {...messages.secondTransitPort} />
          </Label>
        }
        input={
          <div className={PortInputsWrapperStyle}>
            <div className={PortInputStyle}>
              <EnumProvider enumType={portType}>
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
              {/* Do not allow delete if there is only one input */}
              <button className={DeleteButtonStyle} type="button">
                <Icon icon="REMOVE" />
              </button>
            </div>
            {/* Adds new input */}
            <NewButton label={<FormattedMessage {...messages.addPort} />} />
          </div>
        }
      />
    </div>
  );
}
