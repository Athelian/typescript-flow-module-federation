// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { injectUid } from 'utils/id';
import { SectionNavBar } from 'components/NavBar';
import { ProductProviderCard } from 'components/Cards';
import { BooleanValue } from 'react-values';
import NewButton from 'components/NavButtons/NewButton';
import SlideView from 'components/SlideView';
import ProductProviderFormWrapper from 'modules/productProvider/form';
import { ProductProvidersContainer } from 'modules/product/form/containers';
import ProductProviderContainer from 'modules/productProvider/form/container';
import {
  ProductProviderSectionWrapperStyle,
  ProductProviderSectionBodyStyle,
  ItemGridStyle,
  EmptyMessageStyle,
} from './style';

function ProductProvidersSection() {
  return (
    <Subscribe to={[ProductProvidersContainer]}>
      {({ state: { productProviders }, setFieldValue }) => (
        <div className={ProductProviderSectionWrapperStyle}>
          <SectionNavBar>
            <NewButton
              title="NEW PROVIDER"
              onClick={() => {
                setFieldValue(
                  `productProviders[${productProviders.length}]`,
                  injectUid({
                    isNew: true,
                    unitVolume: {
                      value: 0,
                      metric: 'm³',
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
                      metric: 'm³',
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
                  })
                );
              }}
            />
          </SectionNavBar>
          <div className={ProductProviderSectionBodyStyle}>
            {productProviders.length === 0 ? (
              <div className={EmptyMessageStyle}>No providers found.</div>
            ) : (
              <div className={ItemGridStyle}>
                {productProviders.map(
                  (productProvider, index): React.Node => (
                    <BooleanValue key={productProvider.id}>
                      {({ value: opened, toggle }) => (
                        <>
                          <SlideView
                            isOpen={opened}
                            onRequestClose={toggle}
                            options={{ width: '1030px' }}
                          >
                            {opened && (
                              <Subscribe to={[ProductProviderContainer]}>
                                {({ initDetailValues }) => (
                                  <ProductProviderFormWrapper
                                    productProvider={productProviders[index]}
                                    isNew={!!productProvider.isNew}
                                    initDetailValues={initDetailValues}
                                    onCancel={toggle}
                                    onSave={() => {
                                      toggle();
                                    }}
                                  />
                                )}
                              </Subscribe>
                            )}
                          </SlideView>
                          <ProductProviderCard productProvider={productProvider} onClick={toggle} />
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
