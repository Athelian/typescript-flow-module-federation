// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Provider, Subscribe } from 'unstated';
import { UIConsumer } from 'modules/ui';
import Layout from 'components/Layout';
import NavBar, { EntityIcon } from 'components/NavBar';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { QueryForm } from 'components/common';

import { containerFormQuery } from './form/query';
import ContainerFormContainer from './form/container';
import ContainerForm from './form/index';

type Props = {
  containerId?: string,
};

export default class ContainerFormModule extends React.PureComponent<Props> {
  render() {
    const { containerId = '' } = this.props;

    if (containerId === '') return null;
    return (
      <Provider>
        <UIConsumer>
          {uiState => (
            <Layout
              {...uiState}
              navBar={
                <NavBar>
                  <EntityIcon icon="CONTAINER" color="CONTAINER" />
                  <JumpToSection>
                    <SectionTabs
                      link="ContainerSection"
                      label={
                        <FormattedMessage
                          id="modules.container.container"
                          defaultMessage="CONTAINER"
                        />
                      }
                      icon="CONTAINER"
                    />
                    <SectionTabs
                      link="ShipmentSection"
                      label={
                        <FormattedMessage
                          id="modules.container.shipment"
                          defaultMessage="SHIPMENT"
                        />
                      }
                      icon="SHIPMENT"
                    />
                    <SectionTabs
                      link="BatchSection"
                      label={
                        <FormattedMessage id="modules.container.batch" defaultMessage="BATCH" />
                      }
                      icon="BATCH"
                    />
                    <SectionTabs
                      link="OrderSection"
                      label={
                        <FormattedMessage id="modules.container.order" defaultMessage="ORDER" />
                      }
                      icon="ORDER"
                    />
                  </JumpToSection>
                </NavBar>
              }
            >
              <QueryForm
                query={containerFormQuery}
                entityId={containerId}
                entityType="container"
                render={container => (
                  <Subscribe to={[ContainerFormContainer]}>
                    {({ initDetailValues }) => (
                      <ContainerForm
                        container={container}
                        onFormReady={() => initDetailValues(container)}
                      />
                    )}
                  </Subscribe>
                )}
              />
            </Layout>
          )}
        </UIConsumer>
      </Provider>
    );
  }
}
