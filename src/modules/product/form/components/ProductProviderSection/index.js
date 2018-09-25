// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { injectUid } from 'utils/id';
import { SectionNavBar } from 'components/NavBar';
import { ProductProviderCard } from 'components/Cards';
import NewButton from 'components/NavButtons/NewButton';
import { ProductProvidersContainer } from 'modules/product/form/containers';
import {
  ProductProviderSectionWrapperStyle,
  ProductProviderSectionBodyStyle,
  ItemGridStyle,
  ItemStyle,
  EmptyMessageStyle,
} from './style';

type Props = {
  isNew: boolean,
};

function ProductProviderSection({ isNew }: Props) {
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
                {productProviders.map(productProvider => (
                  <div className={ItemStyle} key={productProvider.id}>
                    <ProductProviderCard productProvider={productProvider} />
                    {isNew}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Subscribe>
  );
}

export default ProductProviderSection;
