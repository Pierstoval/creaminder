export default function Loader ({fullWidth}) {
    const className = 'loader '+(fullWidth ? 'full' : '');

    return <span className={className}>⌛</span>;
}
