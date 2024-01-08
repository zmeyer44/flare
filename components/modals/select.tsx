import {
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
  DrawerBody,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { modal } from "@/app/_providers/modal";
import Spinner from "@/components/spinner";

type SelectModalProps<ItemType> = {
  title?: string;
  description?: string;
  listContainerClassName?: string;
  options: ItemType[];
  getKeyAndLabel: (i: ItemType) => { key: string; label: string };
  selected?: ItemType;
  loadingOptions?: boolean;
  onSelect: (i: ItemType) => void;
};

export default function SelectModal<ItemType>({
  title = "Select an option",
  description,
  listContainerClassName,
  options,
  getKeyAndLabel,
  selected,
  onSelect,
  loadingOptions,
}: SelectModalProps<ItemType>) {
  return (
    <>
      <DrawerHeader>
        <DrawerTitle className="text-xl">{title}</DrawerTitle>
        {!!description && <DrawerDescription>{description}</DrawerDescription>}
      </DrawerHeader>
      <DrawerBody className="">
        <ul className={cn("space-y-4", listContainerClassName)}>
          {options.map((p) => (
            <li key={getKeyAndLabel(p).key} className="">
              <TileButton
                onClick={() => onSelect(p)}
                active={
                  selected &&
                  getKeyAndLabel(p).key === getKeyAndLabel(selected).key
                }
                className="w-full font-semibold"
              >
                {getKeyAndLabel(p).label}
              </TileButton>
            </li>
          ))}
        </ul>
        {loadingOptions && (
          <div className="center py-3">
            <Spinner />
          </div>
        )}
      </DrawerBody>
      <DrawerFooter></DrawerFooter>
    </>
  );
}

type TileButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
};
export function TileButton({
  active,
  className,
  children,
  ...props
}: TileButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "hover flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 transition-all",
        active
          ? "border-primary hover:opacity-70"
          : "text-muted-foreground hover:border-muted-foreground hover:bg-muted hover:text-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}
