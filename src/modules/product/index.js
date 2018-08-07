// @flow
import * as React from 'react';
import Layout from 'components/Layout';
import { Form, Field, FieldObserver } from 'components/Form';
import TextInput from 'components/TextInput';
import { UIConsumer } from 'modules/ui';
import logger from 'utils/logger';
import NavBar, {
  EntityIcon,
  // NOTE: hide for now
  // ViewToggle,
  FilterInput,
  SortInput,
  SearchInput,
  ActiveToggleTabs,
} from 'components/NavBar';
import ProductList from './list';

type Props = {};
type State = {
  viewType: string,
  query: string,
  status: string,
  sort: {
    field: string,
    direction: string,
  },
  perPage: number,
};

// TODO: We will restructure when we're working on new form system
class ProductModule extends React.Component<Props, State> {
  state = {
    viewType: 'grid',
    query: '',
    status: 'Active',
    sort: {
      field: 'updatedAt',
      direction: 'DESC',
    },
    perPage: 10,
  };

  onChangeFilter = (field: string, newValue: any) => {
    this.setState(prevState => ({ ...prevState, [field]: newValue }));
  };

  render() {
    const { viewType, sort, perPage, ...filters } = this.state;
    // TODO: i18n message
    const fields = [
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
              <NavBar>
                <EntityIcon icon="farProduct" color="RED" />
                <ActiveToggleTabs
                  onChange={index => this.onChangeFilter('status', index ? 'Inactive' : 'Active')}
                />
                {/* <ViewToggle
                  changeToggle={newViewType => this.onChangeFilter('viewType', newViewType)}
                  selectedView={viewType}
                  viewTypes={[
                    { icon: 'fasWaterfall', type: 'grid' },
                    { icon: 'farTable', type: 'table' },
                    { icon: 'farList', type: 'list' },
                  ]}
                /> */}
                <SortInput
                  sort={fields.find(item => item.value === sort.field) || fields[0]}
                  ascending={sort.direction !== 'DESC'}
                  fields={fields}
                  onChange={({ field: { value }, ascending }) =>
                    this.onChangeFilter('sort', {
                      field: value,
                      direction: ascending ? 'ASC' : 'DESC',
                    })
                  }
                />
                <Form initialValues={{ ...filters }}>
                  {({ values, setFieldValue }) => (
                    <React.Fragment>
                      <FilterInput
                        initialFilter={{}}
                        onChange={newFilter => logger.warn('filter', newFilter)}
                        width={400}
                      >
                        {({ setFieldValue: changeQuery }) => (
                          <React.Fragment>
                            <SearchInput
                              value=""
                              name="search"
                              onClear={() => changeQuery('query', '')}
                              onChange={newValue => changeQuery('query', newValue)}
                            />
                            <TextInput onBlur={() => {}} onChange={() => {}} />
                          </React.Fragment>
                        )}
                      </FilterInput>
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
            <ProductList sort={sort} viewType={viewType} perPage={perPage} filter={filters} />
          </Layout>
        )}
      </UIConsumer>
    );
  }
}

export default ProductModule;
