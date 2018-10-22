// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { isEquals } from 'utils/fp';
import { SectionHeader, SectionWrapper, LastModified } from 'components/Form';
import { CloneButton } from 'components/Buttons';
import { encodeId } from 'utils/id';
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

  onClone = () => {
    const { warehouse } = this.props;
    navigate(`/warehouse/clone/${encodeId(warehouse.id)}`);
  };

  render() {
    const { warehouse, isNew } = this.props;

    return (
      <div className={WarehouseFormWrapperStyle}>
        <SectionWrapper id="warehouseSection">
          <SectionHeader
            icon="WAREHOUSE"
            title={
              <FormattedMessage id="modules.WareHouses.warehouse" defaultMessage="WAREHOUSE" />
            }
          >
            {!isNew && (
              <>
                <LastModified updatedAt={warehouse.updatedAt} updatedBy={warehouse.updatedBy} />
                <CloneButton onClick={this.onClone} />
              </>
            )}
          </SectionHeader>
          <WarehouseSection isNew={isNew} />
        </SectionWrapper>
      </div>
    );
  }
}

export default WarehouseForm;
