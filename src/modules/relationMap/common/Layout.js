// @flow
import * as React from 'react';
import { navigate, Location, Link } from '@reach/router';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { injectUid } from 'utils/id';
import { UIConsumer } from 'modules/ui';
import Layout from 'components/Layout';
import Tabs from 'components/NavBar/components/Tabs';
import { EntityIcon, RelationMapNavBar } from 'components/NavBar';
import { ContentWrapperStyle } from 'modules/relationMap/style';
import messages from 'modules/relationMap/messages';
import { NewButton } from 'components/Buttons';

type Props = {
  onChangeTab: Function,
  intl: IntlShape,
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
      case 2:
        navigate('/relation-map/products');
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
                    case '/relation-map/products':
                      activeIndex = 2;
                      break;
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
          <div className={ContentWrapperStyle}>{children}</div>
        </Layout>
      )}
    </UIConsumer>
  );
};
RelationMapLayout.defaultProps = defaultProps;
export default injectIntl(RelationMapLayout);
