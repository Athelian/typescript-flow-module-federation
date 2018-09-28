// @flow
import * as React from 'react';
import { navigate, Location, Link } from '@reach/router';
import { injectIntl, intlShape } from 'react-intl';
import { injectUid } from 'utils/id';
import { UIConsumer } from 'modules/ui';
import Layout from 'components/Layout';
import Tabs from 'components/NavBar/components/Tabs';
import { EntityIcon, RelationMapNavBar } from 'components/NavBar';
import { RelationMapGrid, ContentWrapperStyle } from 'modules/relationMap/style';
import messages from 'modules/relationMap/messages';
import { NewButton, BaseButton } from 'components/Buttons';
import { ActionSection1, ActionSection2 } from './ActionsSection';

type Props = {
  onChangeTab: Function,
  intl: intlShape,
  children: React.Node,
};

const defaultProps = {
  onChangeTab: tabIndex => {
    switch (tabIndex) {
      default:
      case 0:
        navigate('/relation-map/orders');
        break;
      case 1:
        navigate('/relation-map/shipments');
        break;
    }
  },
};
const RelationMapLayout = ({ onChangeTab, intl, children }: Props) => {
  const tabs = [
    { icon: 'ORDER', label: intl.formatMessage(messages.ordersTab) },
    { icon: 'SHIPMENT', label: intl.formatMessage(messages.shipmentsTab) },
    { icon: 'PRODUCT', label: intl.formatMessage(messages.productsTab) },
  ];
  return (
    <UIConsumer>
      {uiState => (
        <Layout
          {...uiState}
          navBar={
            <RelationMapNavBar>
              <EntityIcon icon="RELATION_MAP" color="RELATION_MAP" />
              <Location>
                {({ location }) => {
                  let activeIndex = 0;
                  switch (location.pathname) {
                    case '/relation-map/shipments':
                      activeIndex = 1;
                      break;
                    case '/relation-map/orders':
                    default:
                      activeIndex = 0;
                      break;
                  }
                  return (
                    <Tabs
                      tabs={tabs.map(injectUid)}
                      onChange={onChangeTab}
                      activeIndex={activeIndex}
                    />
                  );
                }}
              </Location>
              <Link to="new">
                <div style={{ float: 'right' }}>
                  <NewButton label="CREATE NEW" />
                </div>
              </Link>
            </RelationMapNavBar>
          }
        >
          <div className={ContentWrapperStyle}>
            <ActionSection1 directive="SELECTED" target="BATCHES" targetNo={0}>
              <BaseButton
                icon="CLONE"
                label="CLONE"
                backgroundColor="TEAL"
                hoverBackgroundColor="TEAL_DARK"
                onClick={() => {}}
              />
              <BaseButton
                icon="SPLIT"
                label="SPLIT"
                backgroundColor="TEAL"
                hoverBackgroundColor="TEAL_DARK"
                onClick={() => {}}
              />
              <BaseButton
                icon="EDIT"
                label="EDIT"
                backgroundColor="TEAL"
                hoverBackgroundColor="TEAL_DARK"
                onClick={() => {}}
              />
              <BaseButton
                icon="CONNECT"
                label="CONNECT"
                backgroundColor="TEAL"
                hoverBackgroundColor="TEAL_DARK"
                onClick={() => {}}
              />
            </ActionSection1>
            <ActionSection2 directive="CONNECT TO" />
            <RelationMapGrid>{children}</RelationMapGrid>
          </div>
        </Layout>
      )}
    </UIConsumer>
  );
};
RelationMapLayout.defaultProps = defaultProps;
export default injectIntl(RelationMapLayout);
