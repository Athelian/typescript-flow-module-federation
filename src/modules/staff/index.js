// @flow
import * as React from 'react';
import Layout from 'components/Layout';
import { UIConsumer } from 'modules/ui';
import NavBar, { EntityIcon } from 'components/NavBar';
import StaffList from './list';

type Props = {};
type State = {
  viewType: string,
  status: string,
  perPage: number,
};

// TODO: We will restructure when we're working on new form system
class StaffModule extends React.Component<Props, State> {
  state = {
    viewType: 'grid',
    status: 'Active',
    perPage: 10,
  };

  onChangeFilter = (field: string, newValue: any) => {
    this.setState(prevState => ({ ...prevState, [field]: newValue }));
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
                <EntityIcon icon="faUsers" color="GRAY_LIGHT" />
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

export default StaffModule;
