import CustomCard from "@/components/local/card";
import Header from "@/components/local/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { faker } from "@faker-js/faker";
import { Download, Heart, Phone } from "lucide-react";

export default function Page() {
  // Generate fake people data
  const data = (count = 5) =>
    Array.from({ length: count }).map(() => ({
      name: faker.person.fullName(),
      age: faker.number.int({ min: 18, max: 60 }),
      image: faker.image.personPortrait(),
      category: faker.helpers.arrayElement([
        "Actor",
        "Model",
        "Director",
        "Performer",
      ]),
    }));

  const talents = data(20);

  return (
    <div className="w-full min-h-screen flex flex-col items-center gap-[10px]">
      {/* Hero Section */}
      <div className="w-full flex items-center gap-8">
        <CustomCard image={faker.image.personPortrait()} profile={true} />

        <div className="w-[40%] flex flex-col gap-8">
          {/* profile infor */}

          <div>
            {/* profile & buttons */}
            <div className="flex w-full justify-between">
              <p className="text-h3 font-semibold">{faker.person.fullName()}</p>
              <div className="flex gap-2">
                <Button variant={"secondary"}>
                  <Heart />
                  Save Profile
                </Button>
                <Button>
                  <Phone />
                  Contact
                </Button>
              </div>
            </div>
            <p>Model</p>
            <p>{faker.lorem.paragraph(5)}</p>
          </div>
          <div className="grid grid-cols-2 gap-y-8 gap-x-2">
            <p>Age: {faker.number.int({ min: 18, max: 60 })} Years Old</p>
            <p>Gender: Male</p>
            <p>Ethnicity: White</p>
            <p>Country: Nigeria</p>
            <p>State: Lagos State</p>
            <p>Experience: 5 Years</p>
          </div>
          <Button>
            <Download /> Download CV
          </Button>
        </div>
      </div>

      <div className="flex gap-2.5 items-center w-full">
        <hr className="w-[244px] bg-foreground" />
        <p className="text-h3 font-semibold">Portfolio </p>
      </div>

      {/* Talent Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 xl:grid-cols-7 gap-12 [grid-template-rows:masonry]">
        {talents.map((talent, i) => (
          <CustomCard
            key={i}
            primary_text={talent.name}
            secondary_text={`${talent.age} Years old`}
            category={talent.category}
            image={talent.image}
          />
        ))}
      </div>
    </div>
  );
}
