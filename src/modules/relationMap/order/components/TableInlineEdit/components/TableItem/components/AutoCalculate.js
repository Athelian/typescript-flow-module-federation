// @flow
import * as React from 'react';
import { Display } from 'components/Form';
import { WrapperStyle } from './style';

type OptionalProps = {
  renderValue: (values: Object, editData: Object) => React.Node,
  id: string,
};

type Props = OptionalProps & {
  values: Object,
  editData: Object,
};

const defaultProps = {
  id: '',
  renderValue: () => '',
};

export default function AutoCalculate({ id, values, editData, renderValue }: Props) {
  return (
    <div className={WrapperStyle}>
      <Display height="30px" align="left" id={id} tabIndex="-1">
        {renderValue(values, editData)}
      </Display>
    </div>
  );
}

AutoCalculate.defaultProps = defaultProps;
