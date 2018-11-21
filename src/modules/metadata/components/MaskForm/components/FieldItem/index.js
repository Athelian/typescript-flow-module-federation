// @flow
import * as React from 'react';

import { Label } from 'components/Form';
import Icon from 'components/Icon';

import { AdjustmentWrapperStyle, AdjustmentFieldsWrapperStyle, CheckBoxStyle } from './style';

type OptionalProps = {
  width: string,
  onClick: Function,
};

type Props = OptionalProps & {
  item: {
    checked: boolean,
    id: string,
    name: string,
  },
};

const defaultProps = {
  width: '200px',
  onClick: () => {},
};

const FieldItem = ({ width, item: { checked, name }, onClick }: Props) => (
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
