import { Label, TextInput } from "flowbite-react";
import {
  FieldValues,
  Path,
  UseControllerProps,
  useController,
} from "react-hook-form";

type Props<TFormData extends FieldValues> = {
  label: string;
  type?: string;
  showLabel?: boolean;
  defaultValue?: string;
} & UseControllerProps<TFormData>;

export default function Input<TFormData extends FieldValues>(
  props: Props<TFormData>
) {
  const { fieldState, field } = useController<TFormData, Path<TFormData>>({
    ...props,
  });

  return (
    <div className="mb-3">
      {props.showLabel && (
        <div className="mb-2 bloc">
          <Label htmlFor={field.name} value={props.label} />
        </div>
      )}
      <TextInput
        {...props}
        {...field}
        placeholder={props.label}
        type={props.type || "text"}
        helperText={fieldState.error?.message}
        color={
          fieldState.error ? "failure" : !fieldState.isDirty ? "" : "success"
        }
      />
    </div>
  );
}
