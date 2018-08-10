// @flow
import * as React from 'react';
import { BooleanValue } from 'react-values';
import SlideView from 'components/SlideView';
import { WrapperStyle } from './style';

const OrderSection = () => (
  <div className={WrapperStyle}>
    <BooleanValue>
      {({ value: opened, toggle }) => (
        <React.Fragment>
          <button type="button" onClick={toggle}>
            Exporter
          </button>
          <SlideView isOpen={opened} onRequestClose={toggle} options={{ width: 400 }}>
            <div style={{ padding: '50px', textAlign: 'center' }}>
              <h1>Select exporter</h1>
            </div>
          </SlideView>
        </React.Fragment>
      )}
    </BooleanValue>
  </div>
);
export default OrderSection;
