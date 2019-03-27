// @flow
import * as React from 'react';
import { BooleanValue } from 'react-values';
import { DefaultStyle, Display } from 'components/Form';
import SelectProduct from 'modules/productProvider/common/SelectProduct';
import SlideView from 'components/SlideView';
import emitter from 'utils/emitter';

type Props = {
  name: string,
  value: Object,
  exporter: string,
  id: string,
};

export default function InlineProductProvider({ name, exporter, value, id }: Props) {
  return (
    <BooleanValue>
      {({ value: opened, set: slideToggle }) => (
        <>
          <button id={`input-${id}`} type="button" onClick={() => slideToggle(true)}>
            <DefaultStyle width="200px" type="button">
              <Display align="left">{value.product.name}</Display>
            </DefaultStyle>
          </button>
          <SlideView isOpen={opened} onRequestClose={() => slideToggle(false)}>
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
