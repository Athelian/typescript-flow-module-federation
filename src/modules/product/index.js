// @flow
import * as React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import Layout from 'components/Layout';
import { UIConsumer } from 'modules/ui';
import NavBar, {
  EntityIcon,
  ViewToggle,
  FilterInput,
  SortInput,
  SearchInput,
  StatusToggleTabs,
} from 'components/NavBar';
import PartnerSelectInput from 'components/PartnerSelectInput';
import ProductList from './list';
import messages from './messages';

type Props = {
  intl: intlShape,
};

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

  onChangeFilter = (newValue: any) => {
    this.setState(prevState => ({ ...prevState, ...newValue }));
  };

  render() {
    const { viewType, sort, perPage, ...filters } = this.state;
    const { intl } = this.props;

    const fields = [
      { title: intl.formatMessage(messages.name), value: 'name' },
      { title: intl.formatMessage(messages.serial), value: 'serial' },
      { title: intl.formatMessage(messages.updatedAt), value: 'updatedAt' },
      { title: intl.formatMessage(messages.createdAt), value: 'createdAt' },
    ];
    return (
      <UIConsumer>
        {uiState => (
          <Layout
            {...uiState}
            navBar={
              <NavBar>
                <EntityIcon icon="PRODUCT" color="PRODUCT" />
                <StatusToggleTabs
                  onChange={index => this.onChangeFilter({ status: index ? 'Inactive' : 'Active' })}
                />
                <ViewToggle
                  changeToggle={newViewType => this.onChangeFilter({ viewType: newViewType })}
                  selectedView={viewType}
                  viewTypes={[{ icon: 'CARD', type: 'grid' }, { icon: 'TABLE', type: 'table' }]}
                />
                <SortInput
                  sort={fields.find(item => item.value === sort.field) || fields[0]}
                  ascending={sort.direction !== 'DESC'}
                  fields={fields}
                  onChange={({ field: { value }, ascending }) =>
                    this.onChangeFilter({
                      sort: {
                        field: value,
                        direction: ascending ? 'ASC' : 'DESC',
                      },
                    })
                  }
                />
                <FilterInput
                  initialFilter={{}}
                  onChange={newFilter => this.onChangeFilter(newFilter)}
                  width={400}
                >
                  {({ values, setFieldValue }) => (
                    <React.Fragment>
                      <SearchInput
                        value=""
                        name="search"
                        onClear={() => setFieldValue('query', '')}
                        onChange={newQuery => setFieldValue('query', newQuery)}
                      />
                      <PartnerSelectInput
                        title="Exporter"
                        types={['Exporter']}
                        value={values.exporterId}
                        onChange={v => setFieldValue('exporterId', v ? v.id : null)}
                      />
                      <PartnerSelectInput
                        title="Supplier"
                        types={['Supplier']}
                        value={values.supplierId}
                        onChange={v => setFieldValue('supplierId', v ? v.id : null)}
                      />
                    </React.Fragment>
                  )}
                </FilterInput>
                <SearchInput
                  value=""
                  name="search"
                  onClear={() => this.onChangeFilter({ query: '' })}
                  onChange={newQuery => this.onChangeFilter({ query: newQuery })}
                />
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

export default injectIntl(ProductModule);
