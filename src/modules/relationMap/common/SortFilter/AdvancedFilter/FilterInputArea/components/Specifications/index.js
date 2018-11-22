// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Label,
  DefaultStyle,
  NumberInput,
  SelectInput,
  DefaultSelect,
  DefaultOptions,
} from 'components/Form';
import {
  SpecificationsWrapperStyle,
  LabelsWrapperStyle,
  MetricInputsBodyWrapperStyle,
  MetricInputsWrapperStyle,
} from './style';
import messages from '../messages';

export default function Specifications() {
  return (
    <div className={SpecificationsWrapperStyle}>
      <div className={LabelsWrapperStyle}>
        <Label>
          <FormattedMessage {...messages.min} />
        </Label>
        <Label>
          <FormattedMessage {...messages.max} />
        </Label>
        <Label>
          <FormattedMessage {...messages.metric} />
        </Label>
      </div>

      <div className={MetricInputsBodyWrapperStyle}>
        <div className={MetricInputsWrapperStyle}>
          <Label>
            <FormattedMessage {...messages.length} />
          </Label>
          <DefaultStyle type="number" forceHoverStyle>
            <NumberInput align="left" />
          </DefaultStyle>
          <DefaultStyle type="number" forceHoverStyle>
            <NumberInput align="left" />
          </DefaultStyle>
          <SelectInput
            value="m"
            items={['cm', 'm']}
            itemToValue={v => v || null}
            itemToString={v => v || ''}
            renderSelect={({ ...rest }) => (
              <DefaultSelect
                {...rest}
                align="left"
                forceHoverStyle
                required
                hideChevron
                width="60px"
              />
            )}
            renderOptions={({ ...rest }) => <DefaultOptions {...rest} align="left" width="60px" />}
          />
        </div>

        <div className={MetricInputsWrapperStyle}>
          <Label>
            <FormattedMessage {...messages.width} />
          </Label>
          <DefaultStyle type="number" forceHoverStyle>
            <NumberInput align="left" />
          </DefaultStyle>
          <DefaultStyle type="number" forceHoverStyle>
            <NumberInput align="left" />
          </DefaultStyle>
          <SelectInput
            value="m"
            items={['cm', 'm']}
            itemToValue={v => v || null}
            itemToString={v => v || ''}
            renderSelect={({ ...rest }) => (
              <DefaultSelect
                {...rest}
                align="left"
                forceHoverStyle
                required
                hideChevron
                width="60px"
              />
            )}
            renderOptions={({ ...rest }) => <DefaultOptions {...rest} align="left" width="60px" />}
          />
        </div>

        <div className={MetricInputsWrapperStyle}>
          <Label>
            <FormattedMessage {...messages.height} />
          </Label>
          <DefaultStyle type="number" forceHoverStyle>
            <NumberInput align="left" />
          </DefaultStyle>
          <DefaultStyle type="number" forceHoverStyle>
            <NumberInput align="left" />
          </DefaultStyle>
          <SelectInput
            value="m"
            items={['cm', 'm']}
            itemToValue={v => v || null}
            itemToString={v => v || ''}
            renderSelect={({ ...rest }) => (
              <DefaultSelect
                {...rest}
                align="left"
                forceHoverStyle
                required
                hideChevron
                width="60px"
              />
            )}
            renderOptions={({ ...rest }) => <DefaultOptions {...rest} align="left" width="60px" />}
          />
        </div>

        <div className={MetricInputsWrapperStyle}>
          <Label>
            <FormattedMessage {...messages.volume} />
          </Label>
          <DefaultStyle type="number" forceHoverStyle>
            <NumberInput align="left" />
          </DefaultStyle>
          <DefaultStyle type="number" forceHoverStyle>
            <NumberInput align="left" />
          </DefaultStyle>
          <SelectInput
            value="m³"
            items={['cm³', 'm³']}
            itemToValue={v => v || null}
            itemToString={v => v || ''}
            renderSelect={({ ...rest }) => (
              <DefaultSelect
                {...rest}
                align="left"
                forceHoverStyle
                required
                hideChevron
                width="60px"
              />
            )}
            renderOptions={({ ...rest }) => <DefaultOptions {...rest} align="left" width="60px" />}
          />
        </div>

        <div className={MetricInputsWrapperStyle}>
          <Label>
            <FormattedMessage {...messages.weight} />
          </Label>
          <DefaultStyle type="number" forceHoverStyle>
            <NumberInput align="left" />
          </DefaultStyle>
          <DefaultStyle type="number" forceHoverStyle>
            <NumberInput align="left" />
          </DefaultStyle>
          <SelectInput
            value="kg"
            items={['g', 'kg', 'ton']}
            itemToValue={v => v || null}
            itemToString={v => v || ''}
            renderSelect={({ ...rest }) => (
              <DefaultSelect
                {...rest}
                align="left"
                forceHoverStyle
                required
                hideChevron
                width="60px"
              />
            )}
            renderOptions={({ ...rest }) => <DefaultOptions {...rest} align="left" width="60px" />}
          />
        </div>
      </div>
    </div>
  );
}
