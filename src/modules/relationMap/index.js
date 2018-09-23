// @flow
import * as React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { UIConsumer } from 'modules/ui';
import Layout from 'components/Layout';
import Tabs from 'components/NavBar/components/Tabs';
import NavBar, { EntityIcon, SortInput, FilterInput, SearchInput } from 'components/NavBar';
import GridColumn from 'components/GridColumn';
import messages from 'modules/relationMap/messages';
import { injectUid } from 'utils/id';
import OrderFocused from './components/OrderFocused';
import ShipmentFocused from './components/ShipmentFocused';
import { FunctionGroupWrapperStyle, FuncitonWrapperStyle, RelationMapGrid } from './style';

type Props = {
  intl: intlShape,
};
type State = {
  tabIndex: number,
  focus: string,
  filter: string,
  sort: {
    field: string,
    direction: string,
  },
};
const sortInput = [
  { title: 'Updated At', value: 'updatedAt' },
  { title: 'Created At', value: 'createdAt' },
];
const getInitialState = () => ({
  tabIndex: 0,
  focus: 'orders',
  filter: '',
  sort: {
    field: 'updatedAt',
    direction: 'DESCENDING',
  },
});
class RelationMapApp extends React.Component<Props, State> {
  state = getInitialState();

  onChangeTabs = (tabIndex: number) => {
    let focus;
    switch (tabIndex) {
      default:
      case 0:
        focus = 'orders';
        break;
      case 1:
        focus = 'shipments';
        break;
    }
    this.setState({ ...getInitialState(), focus });
  };

  onChangeFilter = (newValue: any) => {
    this.setState(prevState => ({ ...prevState, ...newValue }));
  };

  render() {
    const { sort, filter, focus } = this.state;
    const { intl } = this.props;

    const tabs = [
      { icon: 'ORDER', label: intl.formatMessage(messages.ordersTab) },
      { icon: 'SHIPMENT', label: intl.formatMessage(messages.shipmentsTab) },
    ];

    return (
      <UIConsumer>
        {uiState => (
          <Layout
            {...uiState}
            navBar={
              <NavBar>
                <EntityIcon icon="RELATION_MAP" color="RELATION_MAP" />
                <Tabs tabs={tabs.map(injectUid)} onChange={this.onChangeTabs} />
              </NavBar>
            }
          >
            <RelationMapGrid>
              <div className={FuncitonWrapperStyle}>
                <SortInput
                  sort={sortInput.find(item => item.value === sort.field) || sortInput[0]}
                  ascending={sort.direction !== 'DESCENDING'}
                  fields={sortInput}
                  onChange={({ field: { value }, ascending }) => {
                    this.onChangeFilter({
                      sort: {
                        field: value,
                        direction: ascending ? 'ASCENDING' : 'DESCENDING',
                      },
                    });
                  }}
                />
                <div className={FunctionGroupWrapperStyle}>
                  <FilterInput
                    initialFilter={{}}
                    onChange={newFilter => this.onChangeFilter({ ...newFilter })}
                    width={400}
                  >
                    {({ values, setFieldValue }) => (
                      <GridColumn>
                        <SearchInput
                          name="filter"
                          value={values.filter}
                          onClear={() => setFieldValue('filter', '')}
                          onChange={newValue => setFieldValue('filter', newValue)}
                        />
                      </GridColumn>
                    )}
                  </FilterInput>
                  <SearchInput
                    name="filter"
                    value={filter}
                    onClear={() => this.onChangeFilter({ filter: '' })}
                    onChange={newQuery => this.onChangeFilter({ filter: newQuery })}
                  />
                </div>
              </div>
              {focus === 'orders' && <OrderFocused sort={sort} filter={filter} />}
              {focus === 'shipments' && <ShipmentFocused sort={sort} filter={filter} />}
            </RelationMapGrid>
          </Layout>
        )}
      </UIConsumer>
    );
  }
}

export default injectIntl(RelationMapApp);
