// @flow
import React from 'react';
import { isEquals } from 'utils/fp';
import { SectionWrapper } from 'components/Form';
import { WarehouseSection } from './components';
import { WarehouseFormWrapperStyle } from './style';

type OptionalProps = {
  isNew: boolean,
  isClone: boolean,
  isLoading: Boolean,
  warehouse: Object,
};

type Props = OptionalProps & {};

const defaultProps = {
  isNew: false,
  isClone: false,
  isLoading: false,
  warehouse: {},
};

export default class WarehouseForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  shouldComponentUpdate(nextProps: Props) {
    const { warehouse } = this.props;
    return !isEquals(warehouse, nextProps.warehouse);
  }

  render() {
    const { isNew, isClone, isLoading } = this.props;

    return (
      <div className={WarehouseFormWrapperStyle}>
        <SectionWrapper id="warehouse_warehouseSection">
          <WarehouseSection isNew={isNew} isClone={isClone} isLoading={isLoading} />
        </SectionWrapper>
      </div>
    );
  }
}
