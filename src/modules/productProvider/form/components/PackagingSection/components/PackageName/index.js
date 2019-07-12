// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Tooltip } from 'components/Tooltip';
import Icon from 'components/Icon';
import {
  PackageItemWrapperStyle,
  BarStyle,
  DefaultButtonStyle,
  DeleteButtonStyle,
  PackageNameStyle,
} from './style';

type Props = {|
  name: ?string,
  isDefault: boolean,
  isActive: boolean,
  onActive: () => void,
  onRemove: () => void,
  onSetDefault: () => void,
  removable: boolean,
  allowToSetDefault: boolean,
|};

export default function PackageName({
  name,
  isActive,
  isDefault,
  removable,
  allowToSetDefault,
  onActive,
  onRemove,
  onSetDefault,
}: Props) {
  const onChangeDefault = React.useCallback(
    evt => {
      evt.stopPropagation();
      if (allowToSetDefault) {
        onSetDefault();
      }
    },
    [allowToSetDefault, onSetDefault]
  );

  const onDelete = React.useCallback(
    evt => {
      evt.stopPropagation();
      if (removable) {
        onRemove();
      }
    },
    [onRemove, removable]
  );

  return (
    <div onClick={onActive} className={PackageItemWrapperStyle} role="presentation">
      <span className={BarStyle(isActive)} />

      <Tooltip
        message={
          <FormattedMessage
            id="components.ProductProviders.defaultPackagingTooltip"
            defaultMessage="Set as Default to automatically load Packaging info into newly created Batches."
          />
        }
      >
        <button onClick={onChangeDefault} className={DefaultButtonStyle(isDefault)} type="button">
          <Icon icon="STAR" />
        </button>
      </Tooltip>

      <div className={PackageNameStyle(!!name)}>
        {name || (
          <FormattedMessage
            defaultMessage="No package name"
            id="modules.ProductProviders.noPackageName"
          />
        )}
      </div>

      {removable && (
        <button className={DeleteButtonStyle} onClick={onDelete} type="button">
          <Icon icon="REMOVE" />
        </button>
      )}
    </div>
  );
}
