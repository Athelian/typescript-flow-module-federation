import React from 'react';
import { SelectInput, DefaultOptions, Label } from 'components/Form';
import Icon from 'components/Icon';
import * as style from './style';

const ConnectPanel = () => (
  <div className={style.PanelWrapperStyle}>
    <Label>Connect</Label>
    <div style={{ display: 'flex' }}>
      <Label>Select</Label>
      <SelectInput
        items={[{ title: 'Shipment', value: 'shipment' }, { title: 'Order', value: 'order' }]}
        itemToString={v => (v ? v.title : '')}
        itemToValue={v => (v ? v.value : null)}
        renderSelect={({ ...rest }) => (
          <button
            type="button"
            onClick={rest.toggle}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'transparent',
              border: 'none',
            }}
          >
            <Icon icon="SHIPMENT" />
            <Label>Shipment</Label>
          </button>
        )}
        renderOptions={({ ...rest }) => (
          <DefaultOptions
            {...rest}
            align="left"
            items={rest.items}
            itemToString={item => item && item.title}
            itemToValue={item => (item ? item.value : '')}
            width="200px"
          />
        )}
      />
    </div>
    <Label>To connect to the list</Label>
    <Label>Connect To</Label>
  </div>
);

export default ConnectPanel;
