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

type ProviderSelectModalProps = {
  providers: { label: string; domain: string; pubkey: string }[];
  activeProvider: { domain: string; pubkey: string };
  onChange: (p: string) => void;
};
export default function ProviderSelectModal({
  providers,
  activeProvider,
  onChange,
}: ProviderSelectModalProps) {
  function handleClick(provider: string) {
    onChange(provider);
    modal.dismiss("provider-select");
  }
  return (
    <>
      <DrawerHeader>
        <DrawerTitle className="text-xl">Choose a Provider</DrawerTitle>
        <DrawerDescription>
          This provider will manage your keys
        </DrawerDescription>
      </DrawerHeader>
      <DrawerBody className="">
        <ul className="space-y-4">
          {providers.map((p) => (
            <li key={p.pubkey} className="">
              <TileButton
                onClick={() => handleClick(p.pubkey)}
                active={p.pubkey === activeProvider.pubkey}
                className="w-full font-semibold"
              >
                {p.label}
              </TileButton>
            </li>
          ))}
        </ul>
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
