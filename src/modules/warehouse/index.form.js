// @flow
import * as React from 'react';
import { FormattedMessage, injectIntl, type IntlShape } from 'react-intl';
import { navigate } from '@reach/router';
import { Provider, Subscribe } from 'unstated';
import { Mutation } from 'react-apollo';
import { prepareCustomFieldsData } from 'utils/customFields';
import { showToastError } from 'utils/errors';
import { findChangeData } from 'utils/data';
import { QueryForm } from 'components/common';
import Portal from 'components/Portal';
import { FormContainer, resetFormState } from 'modules/form';
import JumpToSection from 'components/JumpToSection';
import SectionTabs from 'components/NavBar/components/Tabs/SectionTabs';
import { SaveButton, CancelButton, ResetButton } from 'components/Buttons';
import { EntityIcon } from 'components/NavBar';
import { decodeId, encodeId } from 'utils/id';
import WarehouseForm from './form';
import WarehouseContainer from './form/containers';
import { warehouseFormQuery } from './form/query';
import { createWarehouseMutation, updateWarehouseMutation, prepareInput } from './form/mutation';
import validator from './form/validator';

type OptionalProps = {
  path: string,
};

type Props = OptionalProps & {
  warehouseId?: string,
  intl: IntlShape,
};

const defaultProps = {
  path: '',
  warehouseId: '',
};

class WarehouseFormModule extends React.PureComponent<Props> {
  static defaultProps = defaultProps;

  onCancel = () => navigate(`/warehouse`);

  onReset = (warehouseContainer: Object, form: Object) => {
    resetFormState(warehouseContainer);
    form.onReset();
  };

  onSave = async (
    formData: Object,
    saveWarehouse: Function,
    onSuccess: Function = () => {},
    onErrors: Function = () => {}
  ) => {
    const { warehouseId } = this.props;

    const input = prepareInput({
      ...formData,
      ...(Object.prototype.hasOwnProperty.call(formData, 'customFields')
        ? { customFields: prepareCustomFieldsData(formData.customFields) }
        : {}),
    });
    if (this.isNewOrClone()) {
      const { data } = await saveWarehouse({
        variables: {
          input,
        },
      });
      const {
        warehouseCreate: { violations },
      } = data;
      if (violations && violations.length) {
        onErrors(violations);
      } else {
        onSuccess();
      }
    } else if (warehouseId) {
      const { data } = await saveWarehouse({
        variables: {
          input,
          id: decodeId(warehouseId),
        },
      });
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
    const { intl } = this.props;

    if (showToastError({ result, intl, entity: 'warehouse' })) {
      return;
    }

    if (this.isNewOrClone()) {
      const { warehouseCreate } = result;
      navigate(`/warehouse/${encodeId(warehouseCreate.id)}`);
    }
  };

  isNew = () => {
    const { path } = this.props;
    return path.startsWith('new');
  };

  isClone = () => {
    const { path } = this.props;
    return path.startsWith('clone');
  };

  isNewOrClone = () => this.isNew() || this.isClone();

  render() {
    const { warehouseId } = this.props;
    const isNewOrClone = this.isNewOrClone();
    let mutationKey = {};
    if (warehouseId && !isNewOrClone) {
      mutationKey = { key: decodeId(warehouseId) };
    }

    return (
      <Provider>
        <Mutation
          mutation={isNewOrClone ? createWarehouseMutation : updateWarehouseMutation}
          onCompleted={this.onMutationCompleted}
          {...mutationKey}
        >
          {(saveWarehouse, { loading: isLoading, error: apiError }) => (
            <>
              <Portal>
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
                <Subscribe to={[WarehouseContainer, FormContainer]}>
                  {(warehouseContainer, form) =>
                    (isNewOrClone || warehouseContainer.isDirty()) && (
                      <>
                        {this.isNewOrClone() ? (
                          <CancelButton onClick={() => this.onCancel()} />
                        ) : (
                          <ResetButton
                            onClick={() => {
                              this.onReset(warehouseContainer, form);
                            }}
                          />
                        )}
                        <SaveButton
                          data-testid="saveButton"
                          disabled={!form.isReady(warehouseContainer.state, validator)}
                          isLoading={isLoading}
                          onClick={() =>
                            this.onSave(
                              isNewOrClone
                                ? warehouseContainer.state
                                : findChangeData(
                                    warehouseContainer.originalValues,
                                    warehouseContainer.state
                                  ),
                              saveWarehouse,
                              () => {
                                warehouseContainer.onSuccess();
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
              </Portal>
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
                      ? { name: `[cloned] ${originalWarehouse.name}` }
                      : originalWarehouse;
                    return (
                      <Subscribe to={[WarehouseContainer]}>
                        {({ initDetailValues }) => (
                          <WarehouseForm
                            isNew={isNewOrClone}
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
            </>
          )}
        </Mutation>
      </Provider>
    );
  }
}

export default injectIntl(WarehouseFormModule);
