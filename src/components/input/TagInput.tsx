import * as React from "react";
import type { TextareaProps } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { ChevronUpIcon, EditIcon } from "lucide-react";
import { Button } from "../ui/button";
import { tagStringToArray } from "@/utils";

export interface TagInputProps extends TextareaProps {}

export const TagInput = React.forwardRef<HTMLTextAreaElement, TagInputProps>(
  ({ defaultValue, children, onChange, className, value, ...props }, ref) => {
    const [valueState, setValueState] = React.useState<string>(
      (defaultValue ?? "") + ""
    );
    const [isEditingState, setIsEditing] = React.useState(
      (value ?? valueState) === ""
    );
    const isEditing =
      isEditingState ||
      tagStringToArray(value?.toString() || valueState).length === 0;
    const setValue = React.useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValueState(e.target.value);
        onChange?.(e);
      },
      [setValueState, onChange]
    );
    const readState =
      children ??
      tagStringToArray(value?.toString() ?? valueState).map((line, idx) => {
        return (
          <Badge key={idx} className="gap-1 font-normal" variant="outline">
            {line}
          </Badge>
        );
      });
    return (
      <div className="flex flex-col gap-1 rounded-md border border-input bg-gray-50 ">
        <div
          className={cn(
            "flex justify-between border-input",
            isEditing && "border-b"
          )}
        >
          <div className="px-3 py-2 gap-1 flex flex-wrap items-center">
            {readState}
          </div>
          {tagStringToArray(value?.toString() ?? valueState).length > 0 && (
            <div className="flex">
              <Button
                variant="ghost"
                type="button"
                size="icon"
                className={"rounded-l-none w-10 h-full"}
                aria-label="edit tags"
                aria-pressed={isEditing}
                onClick={() => {
                  setIsEditing((state) => {
                    return !state;
                  });
                }}
              >
                {isEditing ? (
                  <ChevronUpIcon className="w-4 h-4" />
                ) : (
                  <EditIcon className="w-4 h-4" />
                )}
              </Button>
            </div>
          )}
        </div>
        {isEditing && (
          <textarea
            autoFocus
            className={cn(
              "flex min-h-[80px] w-full rounded-b-md text-sm ring-offset-background px-3 py-2 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            ref={ref}
            {...props}
            value={value ?? valueState}
            onChange={setValue}
          />
        )}
      </div>
    );
  }
);
TagInput.displayName = "TagInput";
