// @flow
import * as React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import Layout from 'components/Layout';
import Tabs from 'components/NavBar/components/Tabs';
import { UIConsumer } from 'modules/ui';
import NavBar, { EntityIcon, SearchInput } from 'components/NavBar';
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

// TODO: We will restructure when we're working on new form system
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
    const { query } = this.state;
    const { intl } = this.props;

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
                <EntityIcon icon="TAGS" color="PURPLE" />
                <React.Fragment>
                  <Tabs tabs={tabs.map(injectUid)} onChange={this.onChangeTabs} />
                  <SearchInput
                    name="query"
                    value={query}
                    onClear={() => this.onChangeFilter({ query: '' })}
                    onChange={newQuery => this.onChangeFilter({ query: newQuery })}
                  />
                </React.Fragment>
              </NavBar>
            }
          >
            <TagsList {...this.state} />
          </Layout>
        )}
      </UIConsumer>
    );
  }
}

export default injectIntl(TagsModule);
