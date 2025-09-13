import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

export default function Page() {
  return (
    <div className="flex gap-2.5">
      <img
        src="/splash.png"
        alt="Splash"
        className="h-[70vh] w-2/3 object-cover"
      />
      <Tabs className="p-8 flex flex-col gap-5 items-center justify-center">
        <div className="flex flex-col gap-2 items-center">
          <p className="text-h3 font-semibold text-center">
            Sign in today, star tomorrow.
          </p>
          <TabsList>
            <TabsTrigger value="talent">Talent</TabsTrigger>
            <TabsTrigger value="scout">Scout</TabsTrigger>
          </TabsList>
          <p className="text-title2 font-medium text-center">
            ✨ Join BC Casting to connect with recruiters, discover
            opportunities, and showcase your talent—all in one place.
          </p>
        </div>
        <TabsContent
          value="talent"
          className="flex flex-col items-center gap-5 w-full"
        >
          <div className="flex gap-2 w-full">
            <Input placeholder="First-Name" className="w-full" />
            <Input placeholder="Last-Name" className="w-full" />
          </div>
          <div className="flex gap-2 w-full">
            <Input placeholder="DD/MM/YY" className="w-full" />
            <Input placeholder="Role" className="w-full" />
          </div>
          <Textarea placeholder="Bio" />
          <Button className="w-full">Continue</Button>
        </TabsContent>

        <TabsContent value="scout" className="flex gap-2 w-full">
          <div className="bg-muted-foreground flex justify-center items-center w-1/2 h-1/2 rounded-3xl">
            <Plus />
          </div>
          <div className="flex flex-col items-center gap-5 w-full">
            <div className="flex gap-2 w-full">
              <Input placeholder="First-Name" className="w-full" />
              <Input placeholder="Last-Name" className="w-full" />
            </div>
            <div className="flex gap-2 w-full">
              <Input placeholder="DD/MM/YY" className="w-full" />
              <Input placeholder="Role" className="w-full" />
            </div>
            <Textarea placeholder="Bio" />
            <Button className="w-full">Continue</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
