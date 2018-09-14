// @flow
import * as React from 'react';
import { Provider, Subscribe } from 'unstated';

import { Query } from 'react-apollo';
import LoadingIcon from 'components/LoadingIcon';
import Layout from 'components/Layout';
import NavBar, { EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/NavButtons';
import { UIConsumer } from 'modules/ui';
import { decodeId } from 'utils/id';
import { getByPathWithDefault } from 'utils/fp';
import TagForm from './form';
import TagContainer from './form/containers';

import query from './form/query';

type Props = {
  tagId?: string,
};

const defaultProps = {
  tagId: '',
};

export default class TagFormContainer extends React.PureComponent<Props> {
  static defaultProps = defaultProps;

  render() {
    const { tagId } = this.props;
    const isNew = tagId === 'new';

    return (
      <Provider>
        <UIConsumer>
          {uiState => (
            <Layout
              {...uiState}
              navBar={
                <NavBar>
                  <EntityIcon icon="TAGS" color="ORDER" />
                  <CancelButton />
                  <SaveButton />
                </NavBar>
              }
            >
              <div>
                {isNew || !tagId ? (
                  <TagForm isNew />
                ) : (
                  <Subscribe to={[TagContainer]}>
                    {tagState => (
                      <Query
                        query={query}
                        variables={{ id: decodeId(tagId) }}
                        fetchPolicy="network-only"
                        onCompleted={result => {
                          const { tag } = result;
                          tagState.initDetailValues(tag);
                        }}
                      >
                        {({ loading, data, error }) => {
                          if (error) {
                            return error.message;
                          }
                          if (loading) return <LoadingIcon />;

                          return <TagForm tag={getByPathWithDefault({}, 'tag', data)} />;
                        }}
                      </Query>
                    )}
                  </Subscribe>
                )}
              </div>
            </Layout>
          )}
        </UIConsumer>
      </Provider>
    );
  }
}
