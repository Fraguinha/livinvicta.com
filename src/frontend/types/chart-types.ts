export type ChartConfig = {
    [k in string]: {
        label?: React.ReactNode;
        icon?: React.ComponentType;
    } & (
        | { color?: string; theme?: never }
        | { color?: never; theme: Record<string, string> }
    );
};

export type ChartContextProps = {
    config: ChartConfig;
};
