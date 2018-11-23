// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import Layout from 'components/Layout';
import { UIConsumer } from 'modules/ui';
import NavBar, { EntityIcon } from 'components/NavBar';
import { NewButton } from 'components/Buttons';
import TableTemplateList from './list';

type Props = {};

type State = {
  viewType: string,
  filter: {
    type: string,
  },
  perPage: number,
  page: number,
};

class TagListModule extends React.Component<Props, State> {
  state = {
    viewType: 'grid',
    filter: {
      type: 'Order',
    },
    perPage: 10,
    page: 1,
  };

  onChangeFilter = (newValue: any) => {
    this.setState(prevState => ({ ...prevState, ...newValue }));
  };

  render() {
    return (
      <UIConsumer>
        {uiState => (
          <Layout
            {...uiState}
            navBar={
              <NavBar>
                <EntityIcon icon="METADATA" color="METADATA" />
                <Link to="new">
                  <NewButton data-testid="newButton" />
                </Link>
              </NavBar>
            }
          >
            <TableTemplateList {...this.state} />
          </Layout>
        )}
      </UIConsumer>
    );
  }
}

export default TagListModule;
