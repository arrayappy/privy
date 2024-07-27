type Props = {
  children: any;
  className?: string;
  href: string;
};

export default function ExternalLink({
  children,
  className,
  href,
}: Props): JSX.Element {
  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}
