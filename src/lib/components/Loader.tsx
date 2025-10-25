export default function Loader ({fullWidth}: {fullWidth?: boolean}) {
    const className = 'loader '+(fullWidth ? 'full' : '');

    return <span className={className}>⌛</span>;
}
