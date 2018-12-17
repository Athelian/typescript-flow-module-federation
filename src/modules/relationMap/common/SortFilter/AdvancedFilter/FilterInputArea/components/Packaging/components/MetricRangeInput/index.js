// @flow
import * as React from 'react';

import {
  DefaultStyle,
  NumberInput,
  SelectInput,
  DefaultSelect,
  DefaultOptions,
} from 'components/Form';

type OptionalProps = {
  min?: number,
  max?: number,
  onChange: Function,
};

type Props = OptionalProps & {
  metric: string,
  metrics: Array<string>,
};

const defaultProps = {
  onChange: () => {},
};

export default function MetricRangeInput({
  min,
  max,
  metric,
  metrics,
  onChange: handleChange,
}: Props) {
  return (
    <>
      <DefaultStyle type="number" forceHoverStyle>
        <NumberInput
          align="left"
          nullable
          value={min}
          onChange={e =>
            handleChange({
              min: e.target.value,
              max,
              metric,
            })
          }
        />
      </DefaultStyle>
      <DefaultStyle type="number" forceHoverStyle>
        <NumberInput
          align="left"
          nullable
          value={max}
          onChange={e =>
            handleChange({
              min,
              max: e.target.value,
              metric,
            })
          }
        />
      </DefaultStyle>
      <SelectInput
        value={metric}
        items={metrics}
        itemToValue={v => v || null}
        itemToString={v => v || ''}
        onChange={newMetric =>
          handleChange({
            min,
            max,
            metric: newMetric,
          })
        }
        renderSelect={({ ...rest }) => (
          <DefaultSelect
            {...rest}
            align="left"
            forceHoverStyle
            required
            hideDropdownArrow
            width="60px"
          />
        )}
        renderOptions={({ ...rest }) => <DefaultOptions {...rest} align="left" width="60px" />}
      />
    </>
  );
}

MetricRangeInput.defaultProps = defaultProps;
