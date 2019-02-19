// @flow
import React from 'react';
import { isEquals } from 'utils/fp';
import { WarehouseSection } from './components';
import { WarehouseFormWrapperStyle } from './style';

type OptionalProps = {
  isNew: boolean,
  warehouse: Object,
  onFormReady: () => void,
};

type Props = OptionalProps & {};

const defaultProps = {
  isNew: false,
  warehouse: {},
  onFormReady: () => {},
};

class WarehouseForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentDidMount() {
    const { onFormReady } = this.props;

    if (onFormReady) onFormReady();
  }

  shouldComponentUpdate(nextProps: Props) {
    const { warehouse } = this.props;

    return !isEquals(warehouse, nextProps.warehouse);
  }

  render() {
    const { isNew } = this.props;

    return (
      <div className={WarehouseFormWrapperStyle}>
        <WarehouseSection isNew={isNew} />
      </div>
    );
  }
}

export default WarehouseForm;
