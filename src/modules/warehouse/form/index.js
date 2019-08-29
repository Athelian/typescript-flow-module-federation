// @flow
import React from 'react';
import { isEquals } from 'utils/fp';
import { WarehouseSection } from './components';
import { WarehouseFormWrapperStyle } from './style';

type OptionalProps = {
  isNew: boolean,
  isClone: boolean,
  warehouse: Object,
};

type Props = OptionalProps & {};

const defaultProps = {
  isNew: false,
  isClone: false,
  warehouse: {},
};

export default class WarehouseForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  shouldComponentUpdate(nextProps: Props) {
    const { warehouse } = this.props;
    return !isEquals(warehouse, nextProps.warehouse);
  }

  render() {
    const { isNew, isClone } = this.props;

    return (
      <div className={WarehouseFormWrapperStyle}>
        <WarehouseSection isNew={isNew} isClone={isClone} />
      </div>
    );
  }
}
