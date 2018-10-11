// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { Provider, Subscribe } from 'unstated';
import { Mutation } from 'react-apollo';
import { QueryForm } from 'components/common';
import Layout from 'components/Layout';
import { UIConsumer } from 'modules/ui';
import { FormContainer } from 'modules/form';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { SaveButton, CancelButton } from 'components/Buttons';
import NavBar, { EntityIcon } from 'components/NavBar';
import { decodeId, encodeId } from 'utils/id';
import WarehouseForm from './form';
import WarehouseContainer from './form/containers';
import { warehouseFormQuery } from './form/query';
import { createWarehouseMutation, updateWarehouseMutation } from './form/mutation';
import validator from './form/validator';

type Props = {
  path: string,
  warehouseId?: string,
};

const defaultProps = {
  path: '',
  warehouseId: '',
};

class WarehouseFormModule extends React.PureComponent<Props> {
  static defaultProps = defaultProps;

  onCancel = () => {
    navigate(`/warehouse`);
  };

  onSave = async (
    formData: Object,
    saveWarehouse: Function,
    onSuccess: Function = () => {},
    onErrors: Function = () => {}
  ) => {
    const { warehouseId } = this.props;

    const { name, street, locality, region, postalCode, country, surface } = formData;
    const input = {
      name,
      street,
      country: country && country.length > 0 ? country : null,
      locality,
      region,
      postalCode,
      surface,
    };
    if (this.isNew()) {
      const { data } = await saveWarehouse({ variables: { input } });
      const {
        warehouseCreate: { violations },
      } = data;
      if (violations && violations.length) {
        onErrors(violations);
      } else {
        onSuccess();
      }
    } else if (warehouseId) {
      const { data } = await saveWarehouse({ variables: { input, id: decodeId(warehouseId) } });
      const {
        warehouseUpdate: { violations },
      } = data;
      if (violations && violations.length) {
        onErrors(violations);
      } else {
        onSuccess();
      }
    }
  };

  onMutationCompleted = (result: Object) => {
    if (this.isNew()) {
      const {
        warehouseCreate: {
          warehouse: { id },
        },
      } = result;
      navigate(`/warehouse/${encodeId(id)}`);
    }
  };

  isNew = () => {
    const { path } = this.props;
    return path.startsWith('new') || path.startsWith('clone');
  };

  isClone = () => {
    const { path } = this.props;
    return path.startsWith('clone');
  };

  render() {
    const { warehouseId } = this.props;
    const isNew = this.isNew();
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
                      <JumpToSection>
                        <SectionTabs
                          link="warehouseSection"
                          label={
                            <FormattedMessage
                              id="modules.warehouse.warehouse"
                              defaultMessage="WAREHOUSE"
                            />
                          }
                          icon="WAREHOUSE"
                        />
                      </JumpToSection>
                      <Subscribe to={[WarehouseContainer, FormContainer]}>
                        {(formState, form) =>
                          (isNew || formState.isDirty()) && (
                            <>
                              <CancelButton onClick={this.onCancel} />
                              <SaveButton
                                disabled={!form.isReady(formState.state, validator)}
                                isLoading={isLoading}
                                onClick={() =>
                                  this.onSave(
                                    formState.state,
                                    saveWarehouse,
                                    () => {
                                      formState.onSuccess();
                                      form.onReset();
                                    },
                                    form.onErrors
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
                  {apiError && <p>Error: Please try again.</p>}
                  {!warehouseId ? (
                    <WarehouseForm warehouse={{}} isNew />
                  ) : (
                    <QueryForm
                      query={warehouseFormQuery}
                      entityId={warehouseId}
                      entityType="warehouse"
                      render={originalWarehouse => {
                        const warehouse = this.isClone()
                          ? { name: originalWarehouse.name }
                          : originalWarehouse;
                        return (
                          <Subscribe to={[WarehouseContainer]}>
                            {({ initDetailValues }) => (
                              <WarehouseForm
                                isNew={isNew}
                                warehouse={warehouse}
                                onFormReady={() => {
                                  initDetailValues(warehouse);
                                }}
                              />
                            )}
                          </Subscribe>
                        );
                      }}
                    />
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

export default WarehouseFormModule;
