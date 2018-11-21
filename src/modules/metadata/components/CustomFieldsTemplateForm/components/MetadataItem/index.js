// @flow
import * as React from 'react';

import { Label } from 'components/Form';
import Icon from 'components/Icon';

import { AdjustmentWrapperStyle, AdjustmentFieldsWrapperStyle, CheckBoxStyle } from './style';

type OptionalProps = {
  width: string,
};

type Props = OptionalProps & {
  item: {
    checked: boolean,
    name: string,
  },
};

const defaultProps = {
  width: '200px',
};

const MetadataItem = ({ width, item: { checked, name } }: Props) => (
  <div className={AdjustmentWrapperStyle}>
    <div className={AdjustmentFieldsWrapperStyle}>
      <div className={CheckBoxStyle(checked)}>
        <Icon icon="CONFIRM" />
      </div>

      <Label width={width}>{name}</Label>
      <Label width={width} align="right">
        Input
      </Label>
    </div>
  </div>
);

MetadataItem.defaultProps = defaultProps;

export default MetadataItem;
