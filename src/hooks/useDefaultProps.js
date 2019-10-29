// @flow

export default function useDefaultProps<P: { [key: string]: any }, DP: $Rest<P, { ... }>>(
  props: P,
  defaultProps: DP
): DP & P {
  return {
    ...defaultProps,
    ...props,
  };
}
