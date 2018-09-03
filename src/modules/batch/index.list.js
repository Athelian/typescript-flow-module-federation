// @flow
import * as React from 'react';
// import { Link } from '@reach/router';
import { injectIntl, intlShape } from 'react-intl';
import Layout from 'components/Layout';
import InputGroup from 'components/Form/InputGroup';
import { UIConsumer } from 'modules/ui';
import NavBar, {
  EntityIcon,
  FilterInput,
  SortInput,
  SearchInput,
  StatusToggleTabs,
} from 'components/NavBar';
import BatchList from './list';
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

class BatchListModule extends React.Component<Props, State> {
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
      { title: intl.formatMessage(messages.batchNo), value: 'no' },
      { title: intl.formatMessage(messages.PO), value: 'PO' },
      {
        title: intl.formatMessage(messages.productName),
        value: 'product',
      },
      {
        title: intl.formatMessage(messages.deliveredAt),
        value: 'deliveredAt',
      },
      {
        title: intl.formatMessage(messages.expiredAt),
        value: 'expiredAt',
      },
      {
        title: intl.formatMessage(messages.producedAt),
        value: 'producedAt',
      },
      {
        title: intl.formatMessage(messages.updatedAt),
        value: 'updatedAt',
      },
      {
        title: intl.formatMessage(messages.createdAt),
        value: 'createdAt',
      },
    ];

    return (
      <UIConsumer>
        {uiState => (
          <Layout
            {...uiState}
            navBar={
              <NavBar>
                <EntityIcon icon="BATCH" color="BATCH" />
                <StatusToggleTabs
                  onChange={index =>
                    this.onChangeFilter({ status: index ? 'Completed' : 'Active' })
                  }
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
                    <InputGroup fieldGap={20}>
                      <SearchInput
                        value={values.query}
                        name="query"
                        onClear={() => setFieldValue('query', '')}
                        onChange={newValue => setFieldValue('query', newValue)}
                      />
                      {/* <PartnerSelectInput
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
                      /> */}
                    </InputGroup>
                  )}
                </FilterInput>
                <SearchInput
                  name="query"
                  value={filters.query}
                  onClear={() => this.onChangeFilter({ query: '' })}
                  onChange={newQuery => this.onChangeFilter({ query: newQuery })}
                />
              </NavBar>
            }
          >
            <BatchList viewType={viewType} sort={sort} perPage={perPage} filter={filters} />
          </Layout>
        )}
      </UIConsumer>
    );
  }
}

export default injectIntl(BatchListModule);
