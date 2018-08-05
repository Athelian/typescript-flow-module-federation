// @flow
import * as React from 'react';
import Layout from 'components/Layout';
import { Form } from 'components/Form';
import TextInput from 'components/TextInput';
import { UIConsumer } from 'modules/ui';
import NavBar, {
  EntityIcon,
  ViewToggle,
  FilterInput,
  SortInput,
  SearchInput,
  ActiveToggleTabs,
} from 'components/NavBar';
import OrderList from './list';
import type { Props as State } from './list';

type Props = {};

// TODO: We will restructure when we're working on new form system
class Order extends React.Component<Props, State> {
  state = {
    viewType: 'grid',
    filter: {
      status: 'Active',
    },
    sort: {
      field: 'updatedAt',
      direction: 'DESC',
    },
    perPage: 10,
  };

  onToggleView = (viewType: string) => {
    this.setState({ viewType });
  };

  onChangeStatus = (tabPosition: number) => {
    if (!tabPosition) {
      this.setState(prevState => ({
        ...prevState,
        filter: {
          status: 'Active',
        },
      }));
    } else {
      this.setState(prevState => ({
        ...prevState,
        filter: {
          status: 'Completed',
        },
      }));
    }
  };

  render() {
    const { viewType } = this.state;
    const fields = [
      { title: 'PO NO.', value: 'PO' },
      { title: 'EXPORTER', value: 'exporter' },
      { title: 'LAST MODIFIED', value: 'updatedAt' },
      { title: 'CREATED ON', value: 'createdAt' },
    ];
    return (
      <UIConsumer>
        {uiState => (
          <Layout
            {...uiState}
            navBar={
              <Form>
                {({ values, setFieldValue }) => (
                  <NavBar>
                    <EntityIcon icon="farOrder" color="RED" />
                    <ActiveToggleTabs onChange={index => this.onChangeStatus(index)} />
                    <ViewToggle
                      changeToggle={this.onToggleView}
                      selectedView={viewType}
                      viewTypes={[
                        { icon: 'fasWaterfall', type: 'grid' },
                        { icon: 'farTable', type: 'table' },
                        { icon: 'farList', type: 'list' },
                      ]}
                    />
                    <SortInput
                      sort={values.sort && values.sort.field ? values.sort.field : fields[0]}
                      ascending={values.sort ? values.sort.ascending : true}
                      fields={fields}
                      onChange={field => setFieldValue('sort', field)}
                    />
                    <FilterInput
                      initialFilter={{}}
                      onChange={newFilter => setFieldValue('filter', newFilter)}
                      width={400}
                    >
                      {({ setFieldValue: changeQuery }) => (
                        <React.Fragment>
                          <SearchInput onChange={query => changeQuery('query', query)} />
                          <TextInput onBlur={() => {}} onChange={() => {}} />
                        </React.Fragment>
                      )}
                    </FilterInput>
                    <SearchInput onChange={() => {}} />
                  </NavBar>
                )}
              </Form>
            }
          >
            <OrderList {...this.state} />
          </Layout>
        )}
      </UIConsumer>
    );
  }
}

export default Order;
