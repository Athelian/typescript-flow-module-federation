// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import GridColumn from 'components/GridColumn';
import { SectionHeader } from 'components/Form';
import { ContainerWarehouseArrivalSectionWrapperStyle } from './style';

type OptionalProps = {
  containers: Array<Object>,
};

type Props = OptionalProps & {};

const defaultProps = {
  containers: [],
};

class ContainerWarehouseArrivalSection extends React.PureComponent<Props> {
  static defaultProps = defaultProps;

  render() {
    const { ...rest } = this.props;

    return (
      <div className={ContainerWarehouseArrivalSectionWrapperStyle} {...rest}>
        <GridColumn>
          <SectionHeader
            icon="WAREHOUSE"
            title={
              <FormattedMessage
                id="modules.Shipments.warehouseArrival"
                defaultMessage="WAREHOUSE ARRIVAL"
              />
            }
          >
            <div>button</div>
          </SectionHeader>
          <div>put summary here</div>
        </GridColumn>
      </div>
    );
  }
}

export default ContainerWarehouseArrivalSection;
