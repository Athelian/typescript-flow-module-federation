// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import useHover from 'hooks/useHover';
import Icon from 'components/Icon';
import {
  PackageItemWrapperStyle,
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
  const [hoverRef, isHovered] = useHover();
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
    <div
      ref={hoverRef}
      onClick={onActive}
      className={PackageItemWrapperStyle(isHovered, isActive)}
      role="presentation"
    >
      <div
        onClick={onChangeDefault}
        className={DefaultButtonStyle(isDefault, isActive)}
        role="presentation"
      >
        <Icon icon="STAR" />
      </div>
      {name ? (
        <div className={PackageNameStyle}>{name}</div>
      ) : (
        <FormattedMessage
          defaultMessage="No package name"
          id="modules.ProductProviders.noPackageName"
        />
      )}

      {removable && (
        <div className={DeleteButtonStyle(isHovered)} onClick={onDelete} role="presentation">
          <Icon icon="REMOVE" />
        </div>
      )}
    </div>
  );
}
