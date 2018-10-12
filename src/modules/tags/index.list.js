// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import Layout from 'components/Layout';
import { UIConsumer } from 'modules/ui';
import NavBar, { EntityIcon } from 'components/NavBar';
import { NewButton } from 'components/Buttons';
import TagsList from './list';

type Props = {};

type State = {
  viewType: string,
  filter: {
    entityTypes: Array<string>,
  },
  perPage: number,
  page: number,
};

class TagListModule extends React.Component<Props, State> {
  state = {
    viewType: 'grid',
    filter: {
      entityTypes: ['Product', 'Order', 'Batch', 'Shipment', 'User'],
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
                <EntityIcon icon="TAG" color="TAG" />
                <Link to="new">
                  <NewButton />
                </Link>
              </NavBar>
            }
          >
            <TagsList {...this.state} />
          </Layout>
        )}
      </UIConsumer>
    );
  }
}

export default TagListModule;
