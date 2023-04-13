/// <reference types="vite/client" />

export type SectionInput = {
    label: string,
    key: string,
    default: boolean|string|number|null,
    button?: MouseEventHandler<HTMLButtonElement>,
}
export type SectionInputProps = {
    data: SectionInput,
}
