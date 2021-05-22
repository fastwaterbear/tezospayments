import { CardElement, PublicCardElementProps } from './CardElement';

export const CardContent = (props: PublicCardElementProps) => {
    return <CardElement elementClassName="card__content" externalClassName={props.className} {...props} />;
};
