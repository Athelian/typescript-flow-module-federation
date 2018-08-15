// @flow
import * as React from 'react';
import { Link } from '@reach/router';
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
import NewButton from 'components/NavButtons/NewButton';
import OrderList from './list';
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

class OrderModule extends React.Component<Props, State> {
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
      { title: intl.formatMessage(messages.poSort), value: 'PO' },
      { title: intl.formatMessage(messages.exporterSort), value: 'exporter' },
      { title: intl.formatMessage(messages.updatedAtSort), value: 'updatedAt' },
      { title: intl.formatMessage(messages.createdAtSort), value: 'createdAt' },
    ];

    return (
      <UIConsumer>
        {uiState => (
          <Layout
            {...uiState}
            navBar={
              <NavBar>
                <EntityIcon icon="ORDER" color="ORDER" />
                <StatusToggleTabs
                  onChange={index =>
                    this.onChangeFilter({ status: index ? 'Completed' : 'Active' })
                  }
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
                  onChange={newFilter => this.onChangeFilter({ ...newFilter })}
                  width={400}
                >
                  {({ values, setFieldValue }) => (
                    <React.Fragment>
                      <SearchInput
                        value={values.query}
                        name="search"
                        onClear={() => setFieldValue('query', '')}
                        onChange={newValue => setFieldValue('query', newValue)}
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
                      <PartnerSelectInput
                        title="Forwarder"
                        types={['Forwarder']}
                        value={values.userId}
                        onChange={v => setFieldValue('userId', v ? v.id : null)}
                      />
                    </React.Fragment>
                  )}
                </FilterInput>
                <SearchInput
                  value={filters.query}
                  name="search"
                  onClear={() => this.onChangeFilter({ query: '' })}
                  onChange={newQuery => this.onChangeFilter({ query: newQuery })}
                />
                <Link to="new">
                  <NewButton />
                </Link>
              </NavBar>
            }
          >
            <OrderList sort={sort} viewType={viewType} perPage={perPage} filter={filters} />
          </Layout>
        )}
      </UIConsumer>
    );
  }
}

export default injectIntl(OrderModule);
