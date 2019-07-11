import * as React from 'react';
import { Subscribe } from 'unstated';
import { FormattedMessage } from 'react-intl';
import { getByPath } from 'utils/fp';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import {
  PRODUCT_PROVIDER_PACKAGES_DELETE,
  PRODUCT_PROVIDER_SET_DEFAULT,
  PRODUCT_PROVIDER_PACKAGES_CREATE,
  PRODUCT_PROVIDER_UPDATE,
} from 'modules/permission/constants/product';
import { ProductProviderPackagesContainer } from 'modules/productProvider/form/containers';
import { SectionHeader, SectionWrapper } from 'components/Form';
import { NewButton } from 'components/Buttons';
import PackagingForm from './components/PackagingForm';
import PackageName from './components/PackageName';
import {
  PackagingWrapperStyle,
  SidebarWrapperStyle,
  ButtonWrapperStyle,
  ScrollbarWrapperStyle,
} from './style';

export default function PackagingSections() {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const [activePackageId, setActivePackageId] = React.useState('');
  return (
    <SectionWrapper id="productProvider_productProviderPackagingSection">
      <SectionHeader
        icon="PACKAGING"
        title={
          <FormattedMessage id="modules.ProductProviders.packaging" defaultMessage="PACKAGING" />
        }
      />
      <Subscribe to={[ProductProviderPackagesContainer]}>
        {({
          state: { packages, defaultPackage },
          getActivePackage,
          newPackaging,
          removePackage,
          setDefault,
          setPackageValue,
        }) => {
          const packageId =
            activePackageId && packages.map(item => item.id).includes(activePackageId)
              ? activePackageId
              : packages[0].id;
          const currentPackage = getActivePackage(packageId);
          return (
            <div className={PackagingWrapperStyle}>
              <div className={SidebarWrapperStyle}>
                <div className={ScrollbarWrapperStyle}>
                  {packages.map(pkg => (
                    <PackageName
                      key={pkg.id}
                      name={pkg.name}
                      isActive={packageId === pkg.id}
                      isDefault={defaultPackage.id === pkg.id}
                      onActive={() => {
                        setActivePackageId(pkg.id);
                      }}
                      onSetDefault={() => setDefault(pkg)}
                      onRemove={() => {
                        removePackage(pkg.id);
                        if (packageId === pkg.id) {
                          setActivePackageId(
                            getByPath('0.id', packages.filter(item => item.id !== pkg.id))
                          );
                        }
                      }}
                      removable={
                        packages.length > 1 && hasPermission([PRODUCT_PROVIDER_PACKAGES_DELETE])
                      }
                      allowToSetDefault={hasPermission([
                        PRODUCT_PROVIDER_UPDATE,
                        PRODUCT_PROVIDER_SET_DEFAULT,
                      ])}
                    />
                  ))}
                </div>
                <div className={ButtonWrapperStyle}>
                  {hasPermission([PRODUCT_PROVIDER_PACKAGES_CREATE]) && (
                    <NewButton
                      data-testid="btnNewPackaging"
                      label={
                        <FormattedMessage
                          id="modules.ProductProviders.newPackaging"
                          defaultMessage="NEW PACKAGING"
                        />
                      }
                      onClick={newPackaging}
                    />
                  )}
                </div>
              </div>
              <PackagingForm
                id={packageId}
                {...currentPackage}
                onChange={(newValue, autoCalculate) =>
                  setPackageValue({
                    autoCalculate,
                    id: packageId,
                    value: newValue,
                  })
                }
              />
            </div>
          );
        }}
      </Subscribe>
    </SectionWrapper>
  );
}
