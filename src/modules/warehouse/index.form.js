// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { Provider, Subscribe } from 'unstated';
import { Query, Mutation } from 'react-apollo';
import Layout from 'components/Layout';
import { UIConsumer } from 'modules/ui';
import { FormContainer } from 'modules/form';
import { SaveButton, CancelButton } from 'components/Buttons';
import NavBar, { EntityIcon } from 'components/NavBar';
import LoadingIcon from 'components/LoadingIcon';
import { decodeId, encodeId } from 'utils/id';
import { getByPathWithDefault } from 'utils/fp';
import WarehouseInfoForm from './form';
import WarehouseContainer from './form/containers';
import query from './form/query';
import { createWarehouseMutation, updateWarehouseMutation } from './form/mutation';
import validator from './form/validator';

type Props = {
  warehouseId?: string,
};

const defaultProps = {
  warehouseId: '',
};

class OrderFormModule extends React.PureComponent<Props> {
  static defaultProps = defaultProps;

  onCancel = () => {
    navigate(`/warehouse`);
  };

  onSave = async (formData: Object, saveWarehouse: Function, onSuccess: Function = () => {}) => {
    const { warehouseId } = this.props;

    const isNew = warehouseId === 'new';

    const { archived, name, street, locality, region, postalCode, country, surface } = formData;
    const input = { archived, name, street, locality, region, postalCode, country, surface };

    if (isNew) {
      await saveWarehouse({ variables: { input } });
    } else if (warehouseId) {
      await saveWarehouse({ variables: { input, id: decodeId(warehouseId) } });
    }

    onSuccess();
  };

  onMutationCompleted = (result: Object) => {
    const { warehouseId } = this.props;
    const isNew = warehouseId === 'new';
    if (isNew) {
      const {
        warehouseCreate: {
          warehouse: { id },
        },
      } = result;
      navigate(`/warehouse/${encodeId(id)}`);
    }
  };

  render() {
    const { warehouseId } = this.props;
    const isNew = warehouseId === 'new';
    let mutationKey = {};
    if (warehouseId && !isNew) {
      mutationKey = { key: decodeId(warehouseId) };
    }

    return (
      <Provider>
        <UIConsumer>
          {uiState => (
            <Mutation
              mutation={isNew ? createWarehouseMutation : updateWarehouseMutation}
              onCompleted={this.onMutationCompleted}
              {...mutationKey}
            >
              {(saveWarehouse, { loading: isLoading, error: apiError }) => (
                <Layout
                  {...uiState}
                  navBar={
                    <NavBar>
                      <EntityIcon icon="WAREHOUSE" color="WAREHOUSE" />
                      <Subscribe to={[WarehouseContainer, FormContainer]}>
                        {(infoState, form) =>
                          (isNew || infoState.isDirty()) && (
                            <>
                              <CancelButton onClick={this.onCancel} />
                              <SaveButton
                                disabled={
                                  !form.isReady(
                                    {
                                      ...infoState.state,
                                    },
                                    validator
                                  )
                                }
                                onClick={() =>
                                  this.onSave(
                                    {
                                      ...infoState.state,
                                    },
                                    saveWarehouse,
                                    () => {
                                      infoState.onSuccess();
                                      form.onReset();
                                    }
                                  )
                                }
                              />
                            </>
                          )
                        }
                      </Subscribe>
                    </NavBar>
                  }
                >
                  {isLoading && <LoadingIcon />}
                  {apiError && <p>Error: Please try again.</p>}
                  {isNew || !warehouseId ? (
                    <WarehouseInfoForm isNew />
                  ) : (
                    <Subscribe to={[WarehouseContainer]}>
                      {infoState => (
                        <Query
                          query={query}
                          variables={{ id: decodeId(warehouseId) }}
                          fetchPolicy="network-only"
                          onCompleted={result => {
                            if (result.warehouse) {
                              const { warehouse } = result;
                              infoState.initDetailValues(warehouse);
                            } else {
                              navigate('/warehouse');
                            }
                          }}
                        >
                          {({ loading, data, error }) => {
                            if (error) {
                              return error.message;
                            }

                            if (loading) return <LoadingIcon />;
                            return (
                              <WarehouseInfoForm
                                warehouse={getByPathWithDefault({}, 'warehouse', data)}
                              />
                            );
                          }}
                        </Query>
                      )}
                    </Subscribe>
                  )}
                </Layout>
              )}
            </Mutation>
          )}
        </UIConsumer>
      </Provider>
    );
  }
}

export default OrderFormModule;
