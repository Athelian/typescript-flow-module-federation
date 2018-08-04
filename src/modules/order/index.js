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

type Props = {};

type State = {
  viewType: string,
  status: 'Active' | 'Completed',
};

class Order extends React.Component<Props, State> {
  state = { viewType: 'grid', status: 'Active' };

  onToggleView = (viewType: string) => {
    this.setState({ viewType });
  };

  onChangeStatus = (tabPosition: number) => {
    if (!tabPosition) {
      this.setState({ status: 'Active' });
    } else {
      this.setState({
        status: 'Completed',
      });
    }
  };

  render() {
    const { viewType, ...filters } = this.state;
    const pagination = { page: 1, perPage: 10 };
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
                      onChange={filter => setFieldValue('filter', filter)}
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
            <OrderList viewType={viewType} {...filters} {...pagination} />
          </Layout>
        )}
      </UIConsumer>
    );
  }
}

export default Order;
