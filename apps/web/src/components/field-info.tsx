import type {AnyFieldApi} from "@tanstack/react-form";

export function FieldInfo({field}: { field: AnyFieldApi }) {
    if (!field.state.meta) return null;

    return (
        <>
            {field.state.meta.isTouched && !field.state.meta.isValid ? (
                <em className="text-destructive text-sm">
                    {field.state.meta.errors.map((err: any, i: number) => (
                        <span key={i}>{err.message ?? String(err)}</span>
                    ))}
                </em>
            ) : null}
            {field.state.meta.isValidating ? 'Validating...' : null}
        </>
    );
}
