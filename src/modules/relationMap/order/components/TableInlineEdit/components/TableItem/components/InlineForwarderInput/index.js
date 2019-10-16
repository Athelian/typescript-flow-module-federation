// @flow
import * as React from 'react';
import { BooleanValue } from 'react-values';
import { DefaultStyle, Display } from 'components/Form';
import SelectPartners from 'components/SelectPartners';
import SlideView from 'components/SlideView';
import emitter from 'utils/emitter';
import { getByPathWithDefault } from 'utils/fp';

type OptionalProps = {
  disabled: boolean,
};

type Props = OptionalProps & {
  name: string,
  values: Object,
  id: string,
};

const defaultProps = {
  disabled: false,
};

export default function InlineForwarderInput({ name, values, id, disabled }: Props) {
  const [entityType, shipmentId, ...fields] = name.split('.');
  const editField = fields.join('.');
  const [isFocused, setIsFocused] = React.useState(false);
  return (
    <BooleanValue>
      {({ value: opened, set: slideToggle }) =>
        disabled ? (
          <DefaultStyle width="200px" type="button" disabled={disabled}>
            <Display id={`input-${id}`} align="left">
              {getByPathWithDefault('', editField, values)}
            </Display>
          </DefaultStyle>
        ) : (
          <>
            <button
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              id={`input-${id}`}
              type="button"
              onClick={() => slideToggle(true)}
            >
              <DefaultStyle isFocused={isFocused} width="200px" type="button">
                <Display align="left">{getByPathWithDefault('', editField, values)}</Display>
              </DefaultStyle>
            </button>
            <SlideView isOpen={opened} onRequestClose={() => slideToggle(false)}>
              {opened && (
                <SelectPartners
                  partnerTypes={['Forwarder']}
                  selected={getByPathWithDefault([], 'forwarders', values)}
                  onCancel={() => slideToggle(false)}
                  onSelect={selected => {
                    slideToggle(false);
                    emitter.emit('INLINE_CHANGE', {
                      name: `${entityType}.${shipmentId}.forwarders`,
                      hasError: false,
                      value: selected,
                    });
                  }}
                />
              )}
            </SlideView>
          </>
        )
      }
    </BooleanValue>
  );
}

InlineForwarderInput.defaultProps = defaultProps;
