// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { SectionNavBar } from 'components/NavBar';
import { ProductProviderCard } from 'components/Cards';
import { BooleanValue } from 'react-values';
import { NewButton } from 'components/Buttons';
import SlideView from 'components/SlideView';
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
      {({ state: { productProviders } }) => (
        <div className={ProductProviderSectionWrapperStyle}>
          <SectionNavBar>
            <NewButton
              label="NEW PROVIDER"
              onClick={() => {
                console.log('Open SlideView with new Product Provider form');
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
                                    onSave={() => {
                                      slideToggle(false);
                                    }}
                                  />
                                )}
                              </Subscribe>
                            )}
                          </SlideView>
                          <ProductProviderCard
                            productProvider={productProvider}
                            onClick={() => slideToggle(true)}
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
