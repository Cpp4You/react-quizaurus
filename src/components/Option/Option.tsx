import React from "react";

import styles from "./Option.module.scss";

export interface OptionProps {
	children: React.ReactNode;
	value: string | number;
	valid?: boolean;
	checked: boolean;
	onSelected?: () => void;
}

export default function Option({ children, valid, onSelected, checked = false }: OptionProps)
{
	return (
		<div
			{ ...(checked ? { "data-checked": "true" } : {}) }
			{ ...(valid !== undefined ? { "data-valid": `${valid}` } : {}) }
			className={styles.Option}
			onClick={onSelected ? onSelected : undefined}
		>
			{children}
		</div>
	);
}