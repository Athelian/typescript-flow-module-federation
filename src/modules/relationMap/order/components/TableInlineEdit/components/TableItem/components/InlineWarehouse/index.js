// @flow
import * as React from 'react';
import { BooleanValue } from 'react-values';
import { DefaultStyle, Display } from 'components/Form';
import SelectWareHouse from 'modules/warehouse/common/SelectWareHouse';
import SlideView from 'components/SlideView';
import emitter from 'utils/emitter';

type Props = {
  name: string,
  value: Object,
  id: string,
};

export default function InlineWarehouse({ name, value, id }: Props) {
  const [isFocused, setIsFocused] = React.useState(false);
  return (
    <BooleanValue>
      {({ value: opened, set: slideToggle }) => (
        <>
          <button
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            id={`input-${id}`}
            type="button"
            onClick={() => slideToggle(true)}
          >
            <DefaultStyle isFocused={isFocused} width="200px" type="button">
              <Display align="left">{value && value.name}</Display>
            </DefaultStyle>
          </button>
          <SlideView isOpen={opened} onRequestClose={() => slideToggle(false)}>
            {opened && (
              <SelectWareHouse
                onSelect={selectedItem => {
                  emitter.emit('INLINE_CHANGE', {
                    name,
                    hasError: false,
                    value: selectedItem,
                  });
                  slideToggle(false);
                }}
                onCancel={() => slideToggle(false)}
                selected={value}
              />
            )}
          </SlideView>
        </>
      )}
    </BooleanValue>
  );
}
