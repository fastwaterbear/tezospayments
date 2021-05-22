import { CardElement, PublicCardElementProps } from './CardElement';

export const CardPreview = (props: PublicCardElementProps) => {
    return <CardElement elementClassName="card__preview" externalClassName={props.className} {...props} />;
};
