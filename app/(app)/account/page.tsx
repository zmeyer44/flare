import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "./ProfileForm";

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          Your Flare profile can be edited and managed here
        </p>
      </div>
      <Separator />
      <ProfileForm />
    </div>
  );
}
