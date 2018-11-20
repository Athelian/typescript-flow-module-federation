// @flow
import * as React from 'react';
import { Provider, Subscribe } from 'unstated';
import { navigate } from '@reach/router';
import { Query } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import Layout from 'components/Layout';
import GridColumn from 'components/GridColumn';
import NavBar, { EntityIcon } from 'components/NavBar';
import TabItem from 'components/NavBar/components/Tabs/components/TabItem';
import LoadingIcon from 'components/LoadingIcon';
import { UIConsumer } from 'modules/ui';
import { getByPathWithDefault } from 'utils/fp';
import MetadataContainer from './container';
import FieldDefinitionsForm from './components/FieldDefinitionsForm';
import CustomFieldsTemplateList from './components/CustomFieldsTemplateList';

import { fieldDefinitionsQuery } from './query';

import { MainContentWrapperStyle } from './style';

type OptionalProps = {
  entityType: string,
};

type Props = OptionalProps & {};

const defaultProps = {
  entityType: 'Order',
};

const MetadataForm = ({ entityType }: Props) => (
  <Provider>
    <UIConsumer>
      {uiState => (
        <Layout
          {...uiState}
          navBar={
            <NavBar>
              <EntityIcon icon="METADATA" color="METADATA" invert />
              <TabItem
                active={entityType === 'Order'}
                label={<FormattedMessage id="modules.metadata.orders" defaultMessage="ORDERS" />}
                icon="ORDER"
                onClick={() => navigate('/metadata/Order')}
              />
              <TabItem
                active={entityType === 'OrderItem'}
                label={<FormattedMessage id="modules.metadata.items" defaultMessage="ITEMS" />}
                icon="ORDER_ITEM"
                onClick={() => navigate('/metadata/OrderItem')}
              />
              <TabItem
                active={entityType === 'Batch'}
                label={<FormattedMessage id="modules.metadata.batches" defaultMessage="BATCHES" />}
                icon="BATCH"
                onClick={() => navigate('/metadata/Batch')}
              />
              <TabItem
                active={entityType === 'Shipment'}
                label={
                  <FormattedMessage id="modules.metadata.shipments" defaultMessage="SHIPMENTS" />
                }
                icon="SHIPMENT"
                onClick={() => navigate('/metadata/Shipment')}
              />
              <TabItem
                active={entityType === 'Product'}
                label={
                  <FormattedMessage id="modules.metadata.products" defaultMessage="PRODUCTS" />
                }
                icon="PRODUCT"
                onClick={() => navigate('/metadata/Product')}
              />
              <TabItem
                active={entityType === 'ProductProvider'}
                label={
                  <FormattedMessage
                    id="modules.metadata.endProducts"
                    defaultMessage="END PRODUCTS"
                  />
                }
                icon="PROVIDER"
                onClick={() => navigate('/metadata/ProductProvider')}
              />
              <TabItem
                active={entityType === 'Warehouse'}
                label={
                  <FormattedMessage id="modules.metadata.warehouse" defaultMessage="WAREHOUSE" />
                }
                icon="WAREHOUSE"
                onClick={() => navigate('/metadata/Warehouse')}
              />
            </NavBar>
          }
        >
          <div className={MainContentWrapperStyle}>
            <GridColumn>
              <Query
                query={fieldDefinitionsQuery}
                variables={{ entityType }}
                fetchPolicy="network-only"
              >
                {({ loading, data, error }) => {
                  if (error) {
                    if (error.message && error.message.includes('403')) {
                      navigate('/403');
                    }
                    return error.message;
                  }

                  if (loading) return <LoadingIcon />;
                  const fieldDefinitions = getByPathWithDefault([], 'fieldDefinitions', data);

                  return (
                    <Subscribe to={[MetadataContainer]}>
                      {({
                        initDetailValues,
                        originalValues,
                        state,
                        setFieldValue,
                        setFieldArrayValue,
                      }) => {
                        const value = { ...originalValues, ...state };

                        return (
                          <FieldDefinitionsForm
                            fieldDefinitions={value.fieldDefinitions}
                            setFieldValue={setFieldValue}
                            setFieldArrayValue={setFieldArrayValue}
                            onSave={() => {
                              console.log({ entityType, fieldDefinitions: value.fieldDefinitions });
                            }}
                            onFormReady={() => {
                              initDetailValues(fieldDefinitions);
                            }}
                          />
                        );
                      }}
                    </Subscribe>
                  );
                }}
              </Query>
            </GridColumn>
            <GridColumn gap="10px">
              <CustomFieldsTemplateList />
            </GridColumn>
          </div>
        </Layout>
      )}
    </UIConsumer>
  </Provider>
);

MetadataForm.defaultProps = defaultProps;

export default MetadataForm;
