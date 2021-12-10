type ExternalLinkProps = Omit<JSX.IntrinsicElements['a'], 'target' | 'rel'>;

export const ExternalLink = (props: ExternalLinkProps) => <a {...props} target="_blank" rel="noopener noreferrer">
  {props.children}
</a>;
