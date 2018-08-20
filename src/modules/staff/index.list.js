// @flow
import * as React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import Layout from 'components/Layout';
import { UIConsumer } from 'modules/ui';
import NavBar, { EntityIcon, StatusToggleTabs } from 'components/NavBar';
import StaffList from './list';

type Props = {
  intl: intlShape,
};

type State = {
  viewType: string,
  query: string,
  status: string,
  perPage: number,
};

class StaffModule extends React.Component<Props, State> {
  state = {
    viewType: 'grid',
    query: '',
    status: 'Active',
    perPage: 10,
  };

  onChangeFilter = (newValue: any) => {
    this.setState(prevState => ({ ...prevState, ...newValue }));
  };

  render() {
    const { viewType, perPage, ...filters } = this.state;

    return (
      <UIConsumer>
        {uiState => (
          <Layout
            {...uiState}
            navBar={
              <NavBar>
                <EntityIcon icon="STAFF" color="STAFF" />
                <StatusToggleTabs
                  onChange={index => this.onChangeFilter({ status: index ? 'Inactive' : 'Active' })}
                />
              </NavBar>
            }
          >
            <StaffList viewType={viewType} perPage={perPage} filter={filters} />
          </Layout>
        )}
      </UIConsumer>
    );
  }
}

export default injectIntl(StaffModule);
