// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import usePermission from 'hooks/usePermission';
import { SectionNavBar } from 'components/NavBar';
import { ProductProviderCard } from 'components/Cards';
import { BooleanValue } from 'react-values';
import { NewButton } from 'components/Buttons';
import SlideView from 'components/SlideView';
import { injectUid } from 'utils/id';
import generateEndProduct from 'utils/product';
import { ProductProvidersContainer } from 'modules/product/form/containers';
import {
  PRODUCT_PROVIDER_FORM,
  PRODUCT_PROVIDER_CREATE,
} from 'modules/permission/constants/product';
import ProductProviderFormWrapper from './components/ProductProviderFormWrapper';
import {
  ProductProviderSectionWrapperStyle,
  ProductProviderSectionBodyStyle,
  ItemGridStyle,
  EmptyMessageStyle,
} from './style';

type Props = {
  isOwner: boolean,
};

function ProductProvidersSection({ isOwner }: Props) {
  const { hasPermission } = usePermission(isOwner);
  return (
    hasPermission(PRODUCT_PROVIDER_FORM) && (
      <Subscribe to={[ProductProvidersContainer]}>
        {({ state: { productProviders }, setFieldValue, removeArrayItem }) => (
          <div className={ProductProviderSectionWrapperStyle}>
            <SectionNavBar>
              {hasPermission(PRODUCT_PROVIDER_CREATE) && (
                <BooleanValue>
                  {({ value: opened, set: slideToggle }) => (
                    <>
                      <NewButton
                        label={
                          <FormattedMessage
                            id="modules.Products.newProvider"
                            defaultMessage="NEW END PRODUCT"
                          />
                        }
                        onClick={() => slideToggle(true)}
                        data-testid="newProviderButton"
                      />
                      <SlideView isOpen={opened} onRequestClose={() => slideToggle(false)}>
                        {opened && (
                          <ProductProviderFormWrapper
                            isAddedProvider
                            productProviders={productProviders}
                            productProvider={{
                              isNew: true,
                              ...generateEndProduct(),
                            }}
                            isNew
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
                      </SlideView>
                    </>
                  )}
                </BooleanValue>
              )}
            </SectionNavBar>
            <div className={ProductProviderSectionBodyStyle}>
              {productProviders.length === 0 ? (
                <div className={EmptyMessageStyle}>
                  <FormattedMessage
                    id="modules.Products.noProviderFound"
                    defaultMessage="Please create at least one end product"
                  />
                </div>
              ) : (
                <div className={ItemGridStyle}>
                  {productProviders.map(
                    (productProvider, index): React.Node => (
                      <BooleanValue key={productProvider.id}>
                        {({ value: opened, set: slideToggle }) => (
                          <>
                            <SlideView isOpen={opened} onRequestClose={() => slideToggle(false)}>
                              {opened && (
                                <ProductProviderFormWrapper
                                  isOwner={isOwner}
                                  productProviders={productProviders}
                                  productProvider={productProviders[index]}
                                  onCancel={() => slideToggle(false)}
                                  onSave={newProvider => {
                                    slideToggle(false);
                                    setFieldValue(`productProviders.${index}`, newProvider);
                                  }}
                                />
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
    )
  );
}

export default ProductProvidersSection;
