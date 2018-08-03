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
};

class Order extends React.Component<Props, State> {
  state = { viewType: 'grid' };

  onToggleView = () => {
    this.setState(prevState => ({ viewType: prevState.viewType === 'list' ? 'grid' : 'list' }));
  };

  render() {
    const { viewType } = this.state;
    const fields = [
      { title: 'UPDATED AT', value: 'PO' },
      { title: 'CREATED AT', value: 'exporter' },
      { title: 'DELETED AT', value: 'updatedAt' },
      { title: 'BORNED AT', value: 'createdAt' },
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
                    <ActiveToggleTabs onChange={index => console.warn('index', index)} />
                    <ViewToggle
                      changeToggle={this.onToggleView}
                      isTableView={viewType === 'list'}
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
            <OrderList viewType={viewType} />
          </Layout>
        )}
      </UIConsumer>
    );
  }
}

export default Order;
