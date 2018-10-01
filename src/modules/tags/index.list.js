// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import { injectIntl, intlShape } from 'react-intl';
import Layout from 'components/Layout';
import Tabs from 'components/NavBar/components/Tabs';
import { UIConsumer } from 'modules/ui';
import NavBar, { EntityIcon } from 'components/NavBar';
import { NewButton } from 'components/Buttons';
import messages from 'modules/tags/messages';
import { injectUid } from 'utils/id';
import TagsList from './list';

type Props = {
  intl: intlShape,
};

type State = {
  viewType: string,
  query: string,
  perPage: number,
  tabIndex: number,
};

class TagsModule extends React.Component<Props, State> {
  state = {
    viewType: 'grid',
    query: '',
    perPage: 10,
    tabIndex: 0,
  };

  onChangeTabs = (tabIndex: number) => {
    this.setState({ tabIndex });
  };

  onChangeFilter = (newValue: any) => {
    this.setState(prevState => ({ ...prevState, ...newValue }));
  };

  render() {
    const { intl } = this.props;
    const { viewType, perPage, tabIndex, ...filters } = this.state;

    const tabs = [
      { icon: 'PRODUCT', label: intl.formatMessage(messages.productTags) },
      { icon: 'SHIPMENT', label: intl.formatMessage(messages.shipmentTags) },
      { icon: 'STAFF', label: intl.formatMessage(messages.userTags) },
      { icon: 'BATCH', label: intl.formatMessage(messages.batchTags) },
    ];

    return (
      <UIConsumer>
        {uiState => (
          <Layout
            {...uiState}
            navBar={
              <NavBar>
                <EntityIcon icon="TAGS" color="GRAY_LIGHT" />
                <Tabs tabs={tabs.map(injectUid)} onChange={this.onChangeTabs} />
                <Link to="new">
                  <NewButton />
                </Link>
              </NavBar>
            }
          >
            <TagsList
              viewType={viewType}
              tabIndex={tabIndex}
              query={filters.query}
              perPage={perPage}
            />
          </Layout>
        )}
      </UIConsumer>
    );
  }
}

export default injectIntl(TagsModule);
