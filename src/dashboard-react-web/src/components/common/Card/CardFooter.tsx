import { CardElement, PublicCardElementProps } from './CardElement';

export const CardFooter = (props: PublicCardElementProps) => {
    return <CardElement elementClassName="card__footer" externalClassName={props.className} {...props} />;
};
