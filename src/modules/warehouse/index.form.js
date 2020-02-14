// @flow
import * as React from 'react';
import { FormattedMessage, injectIntl, type IntlShape } from 'react-intl';
import { navigate } from '@reach/router';
import { Provider, Subscribe } from 'unstated';
import { Mutation } from 'react-apollo';
import { showToastError } from 'utils/errors';
import { Content } from 'components/Layout';
import { NavBar, EntityIcon } from 'components/NavBar';
import { FormContainer } from 'modules/form';
import QueryFormV2 from 'components/common/QueryFormV2';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { CancelButton } from 'components/Buttons';
import ResetFormButton from 'components/ResetFormButton';
import SaveFormButton from 'components/SaveFormButton';
import { removeTypename } from 'utils/data';
import { getByPath } from 'utils/fp';
import { decodeId, encodeId, uuid } from 'utils/id';
import { defaultAreaMetric } from 'utils/metric';
import WarehouseForm from './form';
import WarehouseInfoContainer from './form/containers';
import { warehouseFormQuery } from './form/query';
import {
  createWarehouseMutation,
  updateWarehouseMutation,
  prepareParsedWarehouseInput,
} from './form/mutation';
import validator from './form/validator';

type OptionalProps = {
  path: string,
  warehouseId: string,
};

type Props = OptionalProps & {
  intl: IntlShape,
};

const defaultProps = {
  path: '',
  warehouseId: '',
};

type CreateWarehouseResponse = {|
  warehouseCreate: {
    violations?: Array<Object>,
    id?: string,
  },
|};

type UpdateWarehouseResponse = {|
  warehouseUpdate: {
    violations?: Array<Object>,
    id?: string,
  },
|};

type WarehouseFormState = {
  warehouseInfoState: Object,
};

const formContainer = new FormContainer();
class WarehouseFormModule extends React.PureComponent<Props> {
  static defaultProps = defaultProps;

  isNew = () => {
    const { path } = this.props;
    return path.startsWith('new');
  };

  isClone = () => {
    const { path } = this.props;
    return path.startsWith('clone');
  };

  isNewOrClone = () => this.isNew() || this.isClone();

  onCancel = () => navigate(`/warehouse`);

  onSave = async (
    originalValues: Object,
    formData: Object,
    saveWarehouse: Function,
    onSuccess: Object => void,
    onErrors: Function = () => {}
  ) => {
    const { warehouseId } = this.props;

    const isNewOrClone = this.isNewOrClone();
    const input = prepareParsedWarehouseInput(
      isNewOrClone ? null : removeTypename(originalValues),
      removeTypename(formData)
    );

    if (isNewOrClone) {
      const { data } = await saveWarehouse({ variables: { input } });
      if (!data) return;

      const {
        warehouseCreate: { violations },
      } = data;
      if (violations && violations.length) {
        onErrors(violations);
      } else {
        onSuccess(getByPath('warehouseCreate', data));
      }
    } else if (warehouseId) {
      const { data } = await saveWarehouse({
        variables: {
          input,
          id: decodeId(warehouseId),
        },
      });
      if (!data) return;

      const {
        warehouseUpdate: { violations },
      } = data;
      if (violations && violations.length) {
        onErrors(violations);
      } else {
        onSuccess(getByPath('warehouseUpdate', data));
      }
    }
  };

  initAllValues = ({ warehouseInfoState }: WarehouseFormState, warehouse: Object) => {
    warehouseInfoState.initDetailValues(warehouse);
    return null;
  };

  initAllValuesForClone = ({ warehouseInfoState }: WarehouseFormState, warehouse: Object) => {
    const { name, ...rest } = warehouse;
    warehouseInfoState.initDetailValues({
      ...rest,
      name: `[cloned] ${name}`,
    });
    return null;
  };

  onFormReady = ({ warehouseInfoState }: WarehouseFormState, warehouse: Object) => {
    const hasInitialStateYet = warehouseInfoState.state.id || Object.keys(warehouse).length === 0;
    if (hasInitialStateYet) return null;

    if (this.isClone()) {
      this.initAllValuesForClone({ warehouseInfoState }, warehouse);
    } else {
      this.initAllValues({ warehouseInfoState }, warehouse);
    }
    return null;
  };

  onMutationCompleted = (result: CreateWarehouseResponse | UpdateWarehouseResponse) => {
    const { intl } = this.props;

    if (showToastError({ intl, result, entity: 'warehouse' })) {
      return;
    }

    if (result.warehouseCreate) {
      const { warehouseCreate } = result;

      if (!warehouseCreate.violations && warehouseCreate.id) {
        navigate(`/warehouse/${encodeId(warehouseCreate.id)}`);
      }
    }
  };

  render() {
    const { warehouseId } = this.props;
    const isNewOrClone = this.isNewOrClone();
    let mutationKey = {};
    if (warehouseId && !isNewOrClone) {
      mutationKey = { key: decodeId(warehouseId) };
    }

    return (
      <Provider inject={[formContainer]}>
        <Mutation
          mutation={isNewOrClone ? createWarehouseMutation : updateWarehouseMutation}
          onCompleted={this.onMutationCompleted}
          {...mutationKey}
        >
          {(saveWarehouse, { loading: isLoading, error: apiError }) => (
            <>
              <NavBar>
                <EntityIcon icon="WAREHOUSE" color="WAREHOUSE" />
                <JumpToSection>
                  <SectionTabs
                    link="warehouse_warehouseSection"
                    label={
                      <FormattedMessage
                        id="modules.WareHouses.warehouse"
                        defaultMessage="WAREHOUSE"
                      />
                    }
                    icon="WAREHOUSE"
                  />
                </JumpToSection>
                <Subscribe to={[WarehouseInfoContainer, FormContainer]}>
                  {(warehouseInfoState, form) => {
                    const isDirty = warehouseInfoState.isDirty();

                    return (
                      <>
                        {isNewOrClone ? (
                          <CancelButton onClick={() => this.onCancel()} />
                        ) : (
                          <>
                            {isDirty && (
                              <ResetFormButton
                                onClick={() => {
                                  this.initAllValues(
                                    { warehouseInfoState },
                                    { ...warehouseInfoState.originalValues }
                                  );
                                  form.onReset();
                                }}
                              />
                            )}
                          </>
                        )}

                        {(isNewOrClone || isDirty) && (
                          <SaveFormButton
                            data-testid="saveButton"
                            disabled={!form.isReady({ ...warehouseInfoState.state }, validator)}
                            isLoading={isLoading}
                            onClick={() =>
                              this.onSave(
                                {
                                  ...warehouseInfoState.originalValues,
                                },
                                {
                                  ...warehouseInfoState.state,
                                },
                                saveWarehouse,
                                updateWarehouse => {
                                  this.initAllValues(
                                    {
                                      warehouseInfoState,
                                    },
                                    {
                                      ...updateWarehouse,
                                    }
                                  );
                                  form.onReset();
                                },
                                form.onErrors
                              )
                            }
                          />
                        )}
                      </>
                    );
                  }}
                </Subscribe>
              </NavBar>
              <Content>
                {apiError && <p>Error: Please try again.</p>}
                {this.isNew() || !warehouseId ? (
                  <>
                    <WarehouseForm isNew />
                    <Subscribe to={[WarehouseInfoContainer]}>
                      {warehouseInfoState =>
                        this.onFormReady(
                          {
                            warehouseInfoState,
                          },
                          {
                            id: uuid(),
                            name: '',
                            street: '',
                            locality: '',
                            region: '',
                            postalCode: '',
                            country: null,
                            surface: {
                              value: 0,
                              metric: defaultAreaMetric,
                            },
                            customFields: {
                              mask: null,
                              fieldValues: [],
                            },
                            organizations: [],
                          }
                        )
                      }
                    </Subscribe>
                  </>
                ) : (
                  <QueryFormV2
                    query={warehouseFormQuery}
                    entityId={warehouseId}
                    entityType="warehouse"
                    render={(warehouse, loading) => (
                      <>
                        <WarehouseForm
                          warehouse={warehouse}
                          isClone={this.isClone()}
                          isLoading={loading}
                        />
                        <Subscribe to={[WarehouseInfoContainer]}>
                          {warehouseInfoState =>
                            this.onFormReady(
                              {
                                warehouseInfoState,
                              },
                              warehouse
                            )
                          }
                        </Subscribe>
                      </>
                    )}
                  />
                )}
              </Content>
            </>
          )}
        </Mutation>
      </Provider>
    );
  }
}

export default injectIntl(WarehouseFormModule);
