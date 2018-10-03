// @flow
import * as React from 'react';
import { SortInput, FilterInput, SearchInput } from 'components/NavBar';
import GridColumn from 'components/GridColumn';
import { GroupFilterStyle } from './style';

type OptionalProps = {
  sortInput: Array<Object>,
};

type Props = OptionalProps & {
  className: string,
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
    const { sortInput, className, children } = this.props;
    const { sort, filter } = this.state;
    return (
      <>
        <div className={className}>
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
