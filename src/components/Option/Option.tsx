import React from "react";

import styles from "./Option.module.scss";

export interface OptionProps {
	children: React.ReactNode;
	value: string | number;
	checked: boolean;
	onSelected?: () => void;
}

export default function Option({ children, onSelected, checked = false }: OptionProps)
{
	return (
		<div
			{ ...(checked ? { "data-checked": "true" } : {}) }
			className={styles.Option}
			onClick={onSelected ? onSelected : undefined}
		>
			{children}
		</div>
	);
}