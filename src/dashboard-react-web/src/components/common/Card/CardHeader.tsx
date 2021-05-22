import { CardElement, PublicCardElementProps } from './CardElement';

export const CardHeader = (props: PublicCardElementProps) => {
    return <CardElement elementClassName="card__header" externalClassName={props.className} {...props} />;
};
