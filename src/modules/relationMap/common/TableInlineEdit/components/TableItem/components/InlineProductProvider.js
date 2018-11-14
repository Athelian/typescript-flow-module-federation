// @flow
import * as React from 'react';
import { BooleanValue } from 'react-values';
import SelectProduct from 'modules/productProvider/common/SelectProduct';
import SlideView from 'components/SlideView';
import emitter from 'utils/emitter';

type Props = {
  name: string,
  value: Object,
  exporter: string,
};

export default function InlineProductProvider({ name, exporter, value }: Props) {
  return (
    <BooleanValue>
      {({ value: opened, set: slideToggle }) => (
        <>
          <div role="presentation" onClick={() => slideToggle(true)}>
            {value.product.name}{' '}
          </div>
          <SlideView
            isOpen={opened}
            onRequestClose={() => slideToggle(false)}
            options={{ width: '1030px' }}
          >
            {opened && (
              <SelectProduct
                onSelect={selectedItem => {
                  emitter.emit('INLINE_CHANGE', {
                    name,
                    hasError: false,
                    value: selectedItem,
                  });
                  slideToggle(false);
                }}
                onCancel={() => slideToggle(false)}
                exporter={exporter}
                selected={value}
              />
            )}
          </SlideView>
        </>
      )}
    </BooleanValue>
  );
}
