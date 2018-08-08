// @flow
import * as React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import Layout from 'components/Layout';
import { Form, Field, FieldObserver } from 'components/Form';
import TextInput from 'components/TextInput';
import { UIConsumer } from 'modules/ui';
import logger from 'utils/logger';
import NavBar, {
  EntityIcon,
  FilterInput,
  SortInput,
  SearchInput,
  ActiveToggleTabs,
} from 'components/NavBar';
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

// TODO: We will restructure when we're working on new form system
class ShipmentModule extends React.Component<Props, State> {
  state = {
    viewType: 'list',
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
    const { intl } = this.props;

    const fields = [
      {
        title: intl.formatMessage(messages.estimatedDeparture),
        value: 'ETD',
      },
      {
        title: intl.formatMessage(messages.estimatedArrival),
        value: 'ETA',
      },
      {
        title: intl.formatMessage(messages.warehouseArrival),
        value: 'warehouseArrival',
      },
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
                <EntityIcon icon="fasShip" color="SHIPMENT_BLUE" />
                <ActiveToggleTabs
                  onChange={index => this.onChangeFilter('status', index ? 'Completed' : 'Active')}
                />
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
            <OrderList sort={sort} viewType={viewType} perPage={perPage} filter={filters} />
          </Layout>
        )}
      </UIConsumer>
    );
  }
}

export default injectIntl(ShipmentModule);
