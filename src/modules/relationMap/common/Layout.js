// @flow
import * as React from 'react';
import { navigate, Location } from '@reach/router';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { injectUid } from 'utils/id';
import { UIConsumer } from 'modules/ui';
import Layout from 'components/Layout';
import Tabs from 'components/NavBar/components/Tabs';
import { EntityIcon, RelationMapNavBar } from 'components/NavBar';
import { ContentWrapperStyle } from 'modules/relationMap/style';
import messages from 'modules/relationMap/messages';

type Props = {
  intl: IntlShape,
  children: React.Node,
};

const ENABLE_SHIPMENT_FOCUSED = false;

const RelationMapLayout = ({ intl, children }: Props) => {
  const tabs = [
    { key: 'orders', icon: 'ORDER', label: intl.formatMessage(messages.ordersTab) },
    ENABLE_SHIPMENT_FOCUSED && {
      key: 'shipments',
      icon: 'SHIPMENT',
      label: intl.formatMessage(messages.shipmentsTab),
    },
    { key: 'products', icon: 'PRODUCT', label: intl.formatMessage(messages.productsTab) },
  ].filter(Boolean);

  const onChangeTab = tabIndex => {
    if (tabs[tabIndex] && tabs[tabIndex].key) {
      navigate(`/relation-map/${tabs[tabIndex].key}`);
    }
  };

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
                  // $FlowFixMe
                  const activeIndex = tabs.findIndex(({ key }) => {
                    const path = `/relation-map/${key}`;
                    return path === location.pathname;
                  });

                  return (
                    <Tabs
                      // $FlowFixMe
                      tabs={tabs.map(injectUid)}
                      onChange={onChangeTab}
                      activeIndex={activeIndex}
                    />
                  );
                }}
              </Location>
            </RelationMapNavBar>
          }
        >
          <div className={ContentWrapperStyle}>{children}</div>
        </Layout>
      )}
    </UIConsumer>
  );
};

export default injectIntl(RelationMapLayout);
