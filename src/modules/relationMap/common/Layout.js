// @flow
import * as React from 'react';
import { Location, navigate } from '@reach/router';
import { Subscribe, Provider } from 'unstated';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { UIConsumer } from 'modules/ui';
import Layout from 'components/Layout';
import Tabs from 'components/NavBar/components/Tabs';
import { EntityIcon, RelationMapNavBar } from 'components/NavBar';
import { ContentWrapperStyle } from 'modules/relationMap/style';
import messages from 'modules/relationMap/messages';
import FloatMenu from 'components/RelationMap/FloatMenu';
import RelationMapContainer from 'modules/relationMap/container';

type Props = {
  intl: IntlShape,
  children: React.Node,
};

const RelationMapLayout = ({ intl, children }: Props) => {
  const tabs = [
    {
      id: 'order-menu-1',
      key: 'orders',
      icon: 'ORDER',
      label: intl.formatMessage(messages.ordersTab),
    },
    {
      id: 'order-menu-2',
      key: 'products',
      icon: 'PRODUCT',
      label: intl.formatMessage(messages.productsTab),
    },
  ].filter(Boolean);

  return (
    <Provider>
      <UIConsumer>
        {uiState => (
          <Layout
            {...uiState}
            navBar={
              <RelationMapNavBar>
                <EntityIcon icon="RELATION_MAP" color="RELATION_MAP" />
                <Location>
                  {({ location }) => (
                    <Tabs
                      tabs={tabs}
                      activeIndex={location.pathname.includes('products') ? 1 : 0}
                      onChange={tabId => {
                        if (tabId) {
                          navigate('products');
                        } else {
                          navigate('orders');
                        }
                      }}
                    />
                  )}
                </Location>
              </RelationMapNavBar>
            }
          >
            <div className={ContentWrapperStyle}>{children}</div>
            <Subscribe to={[RelationMapContainer]}>
              {({ isTargetTreeMode, isTargetMode }) =>
                isTargetMode() || isTargetTreeMode() ? <FloatMenu /> : null
              }
            </Subscribe>
          </Layout>
        )}
      </UIConsumer>
    </Provider>
  );
};

export default injectIntl(RelationMapLayout);
