import CustomCard from "@/components/local/card";
import Header from "@/components/local/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { faker } from "@faker-js/faker";
import Link from "next/link";

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
    <div className="w-full min-h-screen flex flex-col items-center gap-[250px]">
      {/* Hero Section */}
      <div className="flex flex-col items-center gap-2.5 justify-center">
        <p className="md:text-h3 text-h5 font-semibold text-center">
          🔍 Find the right talent, faster.
        </p>
        <p className="md:text-h5 text-title2 font-medium md:w-[50%] text-center text-secondary-foreground">
          Easily explore our network of actors, models, directors, and more.
          With powerful search tools, finding the right match for your next
          project has never been simpler.
        </p>
        <div className="flex gap-3 w-[50%] max-md:w-[90%]">
          <Input placeholder="Find a Talent" className="w-full" />
          <Button>Find New Talent</Button>
        </div>
      </div>

      {/* Talent Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-12 [grid-template-rows:masonry]">
        {talents.map((talent, i) => (
          <Link href={`/${talent.name}`} key={i}>
            <CustomCard
              primary_text={talent.name}
              secondary_text={`${talent.age} Years old`}
              category={talent.category}
              image={talent.image}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
