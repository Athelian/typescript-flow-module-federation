// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { isEquals } from 'utils/fp';
import { SectionHeader, SectionWrapper, LastModified } from 'components/Form';
import { WarehouseSection } from './components';
import { WarehouseFormWrapperStyle } from './style';

type OptionalProps = {
  isNew: boolean,
  warehouse: Object,
  onDetailReady: () => void,
};

type Props = OptionalProps & {};

const defaultProps = {
  isNew: false,
  warehouse: {},
  onDetailReady: () => {},
};

class WarehouseForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentDidMount() {
    const { onDetailReady } = this.props;

    if (onDetailReady) onDetailReady();
  }

  shouldComponentUpdate(nextProps: Props) {
    const { warehouse } = this.props;

    return !isEquals(warehouse, nextProps.warehouse);
  }

  render() {
    const { warehouse, isNew } = this.props;

    return (
      <div className={WarehouseFormWrapperStyle}>
        <SectionWrapper id="warehouseSection">
          <SectionHeader
            icon="WAREHOUSE"
            title={<FormattedMessage id="modules.warehouse.warehouse" defaultMessage="WAREHOUSE" />}
          >
            {!isNew && (
              <>
                <LastModified updatedAt={warehouse.updatedAt} updatedBy={warehouse.updatedBy} />
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
