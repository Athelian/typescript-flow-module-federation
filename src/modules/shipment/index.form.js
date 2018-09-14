// @flow
import * as React from 'react';
import { Provider } from 'unstated';
import { navigate } from '@reach/router';
import Layout from 'components/Layout';
import { UIConsumer } from 'modules/ui';
import NavBar, { EntityIcon } from 'components/NavBar';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { encodeId } from 'utils/id';
import ShipmentForm from './form';

type Props = {
  shipmentId?: string,
};

const defaultProps = {
  shipmentId: '',
};

class ShipmentFormModule extends React.Component<Props> {
  static defaultProps = defaultProps;

  onMutationCompleted = (result: Object) => {
    const { shipmentId } = this.props;
    const isNew = shipmentId === 'new';
    if (isNew) {
      const {
        createDeepShipment: { id },
      } = result;
      navigate(`/shipment/${encodeId(id)}`);
    }
  };

  render() {
    const { shipmentId } = this.props;
    const isNew = shipmentId === 'new';

    return (
      <Provider>
        <UIConsumer>
          {uiState => (
            <Layout
              {...uiState}
              navBar={
                <NavBar>
                  <EntityIcon icon="SHIPMENT" color="SHIPMENT" />
                  <JumpToSection>
                    <SectionTabs link="shipmentSection" label="SHIPMENT" icon="SHIPMENT" />
                    <SectionTabs link="timelineSection" label="TIMELINE" icon="TIMELINE" />
                  </JumpToSection>
                </NavBar>
              }
            >
              {isNew || !shipmentId ? (
                <ShipmentForm shipment={{}} isNew />
              ) : (
                <ShipmentForm shipment={{}} />
              )}
            </Layout>
          )}
        </UIConsumer>
      </Provider>
    );
  }
}

export default ShipmentFormModule;
