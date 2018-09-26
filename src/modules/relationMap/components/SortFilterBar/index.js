// @flow
import * as React from 'react';
import { SortInput, FilterInput, SearchInput, FocusInput } from 'components/NavBar';
import GridColumn from 'components/GridColumn';
import { GroupFilterStyle } from './style';

type Props = {
  className: string,
  sortInput: Array<Object>,
  focusInput: Array<Object>,
  children: Function,
};

type State = {
  filter: string,
  sort: {
    field: string,
    direction: string,
  },
};

const defaultProps = {
  sortInput: [
    { title: 'Updated At', value: 'updatedAt' },
    { title: 'Created At', value: 'createdAt' },
  ],
  focusInput: [
    { title: 'Order', value: 'order' },
    { title: 'Shipment', value: 'shipment' },
    { title: 'Product', value: 'product' },
  ],
};
class SortFilterBar extends React.Component<Props, State> {
  static defaultProps = defaultProps;

  state = {
    filter: '',
    sort: {
      field: 'updatedAt',
      direction: 'DESCENDING',
    },
  };

  onChangeFilter = (newValue: any) => {
    this.setState(prevState => ({ ...prevState, ...newValue }));
  };

  render() {
    const { focusInput, sortInput, className, children } = this.props;
    const { sort, filter } = this.state;
    return (
      <>
        <div className={className}>
          <FocusInput
            focus={focusInput.find(item => item.value === sort.field) || focusInput[0]}
            fields={focusInput}
            onChange={() => {}}
          />
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
          <div className={GroupFilterStyle}>
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
        {children({ sort, filter, onChangeFilter: this.onChangeFilter })}
      </>
    );
  }
}

export default SortFilterBar;
