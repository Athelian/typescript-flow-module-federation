// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { SectionNavBar } from 'components/NavBar';
import { ProductProviderCard } from 'components/Cards';
import { BooleanValue } from 'react-values';
import { NewButton } from 'components/Buttons';
import SlideView from 'components/SlideView';
import { injectUid } from 'utils/id';
import { ProductProvidersContainer } from 'modules/product/form/containers';
import ProductProviderContainer from 'modules/productProvider/form/container';
import ProductProviderFormWrapper from './components/ProductProviderFormWrapper';
import {
  ProductProviderSectionWrapperStyle,
  ProductProviderSectionBodyStyle,
  ItemGridStyle,
  EmptyMessageStyle,
} from './style';

function ProductProvidersSection() {
  return (
    <Subscribe to={[ProductProvidersContainer]}>
      {({ state: { productProviders }, setFieldValue, removeArrayItem }) => (
        <div className={ProductProviderSectionWrapperStyle}>
          <SectionNavBar>
            <BooleanValue>
              {({ value: opened, set: slideToggle }) => (
                <>
                  <NewButton
                    label={
                      <FormattedMessage
                        id="modules.product.newProvider"
                        defaultMessage="NEW PROVIDER"
                      />
                    }
                    onClick={() => slideToggle(true)}
                  />
                  <SlideView
                    isOpen={opened}
                    onRequestClose={() => slideToggle(false)}
                    options={{ width: '1030px' }}
                  >
                    {opened && (
                      <Subscribe to={[ProductProviderContainer]}>
                        {({ initDetailValues }) => (
                          <ProductProviderFormWrapper
                            productProvider={injectUid({
                              isNew: true,
                              unitVolume: {
                                value: 0,
                                metric: 'cm³',
                              },
                              unitSize: {
                                width: {
                                  value: 0,
                                  metric: 'cm',
                                },
                                height: {
                                  value: 0,
                                  metric: 'cm',
                                },
                                length: {
                                  value: 0,
                                  metric: 'cm',
                                },
                              },
                              unitWeight: {
                                value: 0,
                                metric: 'kg',
                              },
                              unitPrice: {
                                amount: 0,
                                currency: 'JPY',
                              },
                              inspectionFee: {
                                amount: 0,
                                currency: 'JPY',
                              },
                              packageGrossWeight: {
                                value: 0,
                                metric: 'kg',
                              },
                              packageVolume: {
                                value: 0,
                                metric: 'cm³',
                              },
                              packageSize: {
                                width: {
                                  value: 0,
                                  metric: 'cm',
                                },
                                height: {
                                  value: 0,
                                  metric: 'cm',
                                },
                                length: {
                                  value: 0,
                                  metric: 'cm',
                                },
                              },
                            })}
                            isNew
                            initDetailValues={initDetailValues}
                            onCancel={() => slideToggle(false)}
                            onSave={newProvider => {
                              slideToggle(false);
                              setFieldValue(
                                `productProviders.${productProviders.length}`,
                                newProvider
                              );
                            }}
                          />
                        )}
                      </Subscribe>
                    )}
                  </SlideView>
                </>
              )}
            </BooleanValue>
          </SectionNavBar>
          <div className={ProductProviderSectionBodyStyle}>
            {productProviders.length === 0 ? (
              <div className={EmptyMessageStyle}>
                <FormattedMessage
                  id="modules.product.noProviderFound"
                  defaultMessage="No providers found. Please create at least one provider."
                />
              </div>
            ) : (
              <div className={ItemGridStyle}>
                {productProviders.map(
                  (productProvider, index): React.Node => (
                    <BooleanValue key={productProvider.id}>
                      {({ value: opened, set: slideToggle }) => (
                        <>
                          <SlideView
                            isOpen={opened}
                            onRequestClose={() => slideToggle(false)}
                            options={{ width: '1030px' }}
                          >
                            {opened && (
                              <Subscribe to={[ProductProviderContainer]}>
                                {({ initDetailValues }) => (
                                  <ProductProviderFormWrapper
                                    productProvider={productProviders[index]}
                                    isNew={!!productProvider.isNew}
                                    initDetailValues={initDetailValues}
                                    onCancel={() => slideToggle(false)}
                                    onSave={newProvider => {
                                      slideToggle(false);
                                      setFieldValue(`productProviders.${index}`, newProvider);
                                    }}
                                  />
                                )}
                              </Subscribe>
                            )}
                          </SlideView>
                          <ProductProviderCard
                            productProvider={productProvider}
                            onClick={() => slideToggle(true)}
                            onRemove={() => removeArrayItem(`productProviders.${index}`)}
                            onClone={({ id, ...rest }) => {
                              setFieldValue(
                                `productProviders.${productProviders.length}`,
                                injectUid({
                                  ...rest,
                                  isNew: true,
                                })
                              );
                            }}
                          />
                        </>
                      )}
                    </BooleanValue>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </Subscribe>
  );
}

export default ProductProvidersSection;
