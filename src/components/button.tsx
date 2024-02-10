import React from "react";
import "../styles/buttons.css";

export interface ExpButtonProps {
    isDebounced: boolean,
    content: string,
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => any
    className: string
}

export type ButtonProps = ExpButtonProps & { [prop: string]: any };

function extractOptions(buttonProps: ButtonProps): { [prop: string]: any } {
    const nullExpButtonProps: ExpButtonProps = {
        isDebounced: false,
        content: "",
        onClick: () => {
        },
        className: ""
    };
    const options: { [prop: string]: any } = {};
    for (let propName of Object.keys(buttonProps)) {
        if (propName in nullExpButtonProps) {
            continue;
        }
        options[propName] = buttonProps[propName];
    }
    return options;
}

export const Button: React.FC<ButtonProps> = (props) => {
    const {
        isDebounced,
        content,
        onClick,
        className
    } = props;


    const [isDebouncing, setIsDebouncing] = React.useState<boolean>(true);

    const debouncedOnClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        if (isDebounced && isDebouncing) return;
        return onClick(e);
    }, [isDebounced, onClick, isDebouncing]);

    React.useEffect(() => {
        if (isDebouncing) {
            setTimeout(() => setIsDebouncing(false), 500);
        }
    }, [isDebouncing]);

    const options = extractOptions(props);
    return <button
        onClick={e => debouncedOnClick(e)}
        className={`Button ${className}`}
        {...options}
    >{content}</button>
}