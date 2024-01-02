import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Tooltip from "@radix-ui/react-tooltip";
import {
  Tooltip as TooltipP,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu as DropdownMenuP,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  useCaptionOptions,
  useMediaPlayer,
  Menu,
  useVideoQualityOptions,
  usePlaybackRateOptions,
  useMediaState,
  useMediaRemote,
} from "@vidstack/react";
import {
  LuCircle as CircleIcon,
  LuCheckCircle as CheckCircle,
  LuArrowLeft as ArrowLeftIcon,
  LuArrowRight as ArrowRightIcon,
} from "react-icons/lu";
import {
  RiSettings4Line as SettingsIcon,
  RiClosedCaptioningFill as SubtitlesIcon,
} from "react-icons/ri";
import { buttonClass, tooltipClass } from "./buttons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface MenuProps {
  side?: DropdownMenu.MenuContentProps["side"];
  align?: DropdownMenu.MenuContentProps["align"];
  offset?: DropdownMenu.MenuContentProps["sideOffset"];
  tooltipSide?: Tooltip.TooltipContentProps["side"];
  tooltipAlign?: Tooltip.TooltipContentProps["align"];
  tooltipOffset?: number;
}

// We can reuse this class for other menus.
const menuClass =
  "animate-out fade-out z-[9999] slide-in-from-bottom-4 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-out-to-bottom-2 flex max-h-[400px] min-w-[260px] flex-col rounded-md border border-white/10 bg-black/95 p-2.5 font-sans text-[15px] font-medium outline-none backdrop-blur-sm duration-300";

export function Captions({
  side = "top",
  align = "end",
  offset = 0,
  tooltipSide = "top",
  tooltipAlign = "center",
  tooltipOffset = 0,
}: MenuProps) {
  const player = useMediaPlayer(),
    options = useCaptionOptions(),
    hint = options.selectedTrack?.label ?? "Off";
  return (
    <DropdownMenu.Root>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <DropdownMenu.Trigger
            aria-label="Subtitles"
            className={buttonClass}
            disabled={options.disabled}
          >
            <SubtitlesIcon className="h-6 w-6" />
          </DropdownMenu.Trigger>
        </Tooltip.Trigger>
        <Tooltip.Content
          className={tooltipClass}
          side={tooltipSide}
          align={tooltipAlign}
          sideOffset={tooltipOffset}
        >
          Captions
        </Tooltip.Content>
      </Tooltip.Root>
      <DropdownMenu.Content
        className={menuClass}
        side={side}
        align={align}
        sideOffset={offset}
        collisionBoundary={player?.el}
      >
        <DropdownMenu.Label className="mb-2 flex w-full items-center px-1.5 text-[15px] font-medium">
          <SubtitlesIcon className="mr-1.5 h-5 w-5 translate-y-px" />
          Captions
          <span className="ml-auto text-sm text-white/50">{hint}</span>
        </DropdownMenu.Label>
        <DropdownMenu.RadioGroup
          aria-label="Captions"
          className="flex w-full flex-col"
          value={options.selectedValue}
        >
          {options.map(({ label, value, select }) => (
            <Radio value={value} onSelect={select} key={value}>
              {label}
            </Radio>
          ))}
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
export function Settings({
  side = "top",
  align = "end",
  offset = 0,
  tooltipSide = "top",
  tooltipAlign = "center",
  tooltipOffset = 0,
}: MenuProps) {
  const player = useMediaPlayer(),
    options = useCaptionOptions(),
    hint = options.selectedTrack?.label ?? "Off";

  return (
    <DropdownMenuP>
      <TooltipProvider>
        <TooltipP delayDuration={100}>
          <TooltipTrigger>
            <DropdownMenuTrigger asChild>
              <Button size={"icon"} variant={"ghost"}>
                <SettingsIcon className="h-7 w-7" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent
            align={tooltipAlign}
            alignOffset={tooltipOffset}
            side={tooltipSide}
            className="bg-black/60"
          >
            <p>Settings</p>
          </TooltipContent>
        </TooltipP>
      </TooltipProvider>

      <DropdownMenuContent align={align} side={side} className="w-56">
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <RateSubmenu />
          <QualitySubmenu />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenuP>
  );
  return (
    <DropdownMenuP>
      <DropdownMenuTrigger
        aria-label="Settings"
        className={buttonClass}
        disabled={options.disabled}
      >
        <Button>
          <SettingsIcon className="h-7 w-7" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className={menuClass}
        side={side}
        align={align}
        sideOffset={offset}
        collisionBoundary={player?.el}
      >
        <DropdownMenuLabel className="mb-2 flex w-full items-center px-1.5 text-[15px] font-medium">
          <SettingsIcon className="mr-1.5 h-5 w-5 translate-y-px" />
          Settings
          <span className="ml-auto text-sm text-white/50">{hint}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <RateSubmenu />
        <DropdownMenuGroup
          aria-label="Captions"
          className="flex w-full flex-col"
          // value={options.selectedValue}
        >
          {options.map(({ label, value, select }) => (
            <Radio value={value} onSelect={select} key={value}>
              {label}
            </Radio>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenuP>
  );
}

function Radio({ children, ...props }: DropdownMenu.MenuRadioItemProps) {
  return (
    <DropdownMenu.RadioItem
      className="group relative flex w-full cursor-pointer select-none items-center justify-start rounded-sm p-2.5 text-sm outline-none ring-media-focus data-[focus]:ring-[3px] hocus:bg-white/10"
      {...props}
    >
      <CircleIcon className="h-4 w-4 text-white group-data-[state=checked]:hidden" />
      <CheckCircle className="hidden h-4 w-4 text-media-brand group-data-[state=checked]:block" />
      <span className="ml-2">{children}</span>
    </DropdownMenu.RadioItem>
  );
}

function RateSubmenu() {
  const label = "Speed",
    normalText = "Normal",
    options = usePlaybackRateOptions({
      normalLabel: normalText,
    }),
    hint =
      options.selectedValue === "1" ? normalText : options.selectedValue + "x";

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>Playback Speed</DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuRadioGroup value={options.selectedValue}>
            {options.map(({ label, value, select, rate, selected }) => (
              <DropdownMenuRadioItem
                value={value}
                onSelect={select}
                key={value}
              >
                <span className="text-sm font-medium text-white">{label}</span>
                {/* <span className="ml-auto bg-white/50 text-xs">{rate}</span> */}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}
function QualitySubmenu() {
  const options = useVideoQualityOptions({ sort: "descending" }),
    autoQuality = useMediaState("autoQuality"),
    remote = useMediaRemote(),
    currentQualityText = options.selectedQuality?.height + "p" ?? "",
    hint = !autoQuality ? currentQualityText : `Auto (${currentQualityText})`;
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>Quality</DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuRadioGroup value={options.selectedValue}>
            {options.map(({ label, value, bitrateText, select }) => (
              <DropdownMenuRadioItem
                value={value}
                onSelect={select}
                key={value}
              >
                <span className="text-sm font-medium text-white">{label}</span>
                <span className="ml-auto bg-white/50 text-xs">
                  {bitrateText}
                </span>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}
