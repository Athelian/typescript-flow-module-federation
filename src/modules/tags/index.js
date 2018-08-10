// @flow
import * as React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { Form, Field, FieldObserver } from 'components/Form';
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

  onChangeFilter = (field: string, newValue: any) => {
    this.setState(prevState => ({ ...prevState, [field]: newValue }));
  };

  render() {
    const { viewType, perPage, tabIndex, ...filters } = this.state;
    const { intl } = this.props;

    const tabs = [
      { icon: 'PRODUCT', label: intl.formatMessage(messages.productTags) },
      { icon: 'SHIPMENT', label: intl.formatMessage(messages.shipmentTags) },
      { icon: 'STAFF', label: intl.formatMessage(messages.userTags) },
      { icon: 'BATCH', label: intl.formatMessage(messages.batchTags) },
      // { icon: 'REQUEST', label: intl.formatMessage(messages.requestTags) },
    ];

    return (
      <UIConsumer>
        {uiState => (
          <Layout
            {...uiState}
            navBar={
              <NavBar>
                <EntityIcon icon="TAGS" color="PURPLE" />
                <Form initialValues={{ ...filters }}>
                  {({ values, setFieldValue }) => (
                    <React.Fragment>
                      <Tabs tabs={tabs.map(injectUid)} onChange={this.onChangeTabs} />
                      <Field
                        value={values.query}
                        name="query"
                        render={({ input }) => (
                          <SearchInput {...input} onClear={() => setFieldValue('query', '')} />
                        )}
                      />
                      <FieldObserver
                        name="query"
                        onChange={({ value }) => this.onChangeFilter('query', value)}
                      />
                    </React.Fragment>
                  )}
                </Form>
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
