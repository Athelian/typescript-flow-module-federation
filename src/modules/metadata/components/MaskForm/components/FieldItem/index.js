// @flow
import * as React from 'react';

import { Label } from 'components/Form';
import Icon from 'components/Icon';

import { AdjustmentWrapperStyle, AdjustmentFieldsWrapperStyle, CheckBoxStyle } from './style';

type OptionalProps = {
  checked: boolean,
  width: string,
  onClick: Function,
};

type Props = OptionalProps & {
  item: {
    id: string,
    name: string,
  },
};

const defaultProps = {
  checked: false,
  width: '200px',
  onClick: () => {},
};

const FieldItem = ({ width, checked, item: { name }, onClick }: Props) => (
  <div className={AdjustmentWrapperStyle}>
    <div className={AdjustmentFieldsWrapperStyle}>
      <button type="button" className={CheckBoxStyle(checked)} onClick={onClick}>
        <Icon icon="CONFIRM" />
      </button>

      <Label width={width}>{name}</Label>
      <Label width={width} align="right">
        Input
      </Label>
    </div>
  </div>
);

FieldItem.defaultProps = defaultProps;

export default FieldItem;
