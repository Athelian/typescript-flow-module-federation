// @flow
import * as React from 'react';

import { Label } from 'components/Form';
import Icon from 'components/Icon';

import { AdjustmentWrapperStyle, AdjustmentFieldsWrapperStyle, CheckBoxStyle } from './style';

type OptionalProps = {
  width: string,
};

type Props = OptionalProps & {
  value: {
    checked: boolean,
    key: string,
    value: string,
  },
};

const defaultProps = {
  width: '200px',
};

const MetadataItem = ({ width, value: { checked, key, value } }: Props) => (
  <div className={AdjustmentWrapperStyle}>
    <div className={AdjustmentFieldsWrapperStyle}>
      <div className={CheckBoxStyle(checked)}>
        <Icon icon="CONFIRM" />
      </div>

      <Label width={width}>{key}</Label>
      <Label width={width} align="right">
        {value}
      </Label>
    </div>
  </div>
);

MetadataItem.defaultProps = defaultProps;

export default MetadataItem;
