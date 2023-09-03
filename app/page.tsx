import { APIResult, Film, Person } from "@/app/types";

async function getSWData(): Promise<APIResult<Person>> {
  const res = await fetch("https://swapi.dev/api/people/", {
    cache: "force-cache",
  });
  return res.json();
}

async function getFilms(people: Array<Person>): Promise<Record<string, Film>> {
  const films: Set<string> = new Set();
  const filmData: Record<string, Film> = {};
  for (const person of people) {
    person.films?.forEach((f) => films.add(f));
  }

  for (const film of Array.from(films)) {
    console.log("fetching: ", film);
    const fetched = await fetch(film, { cache: "force-cache" });
    filmData[film] = await fetched.json();
  }

  return filmData;
}

export default async function Home() {
  const data = await getSWData();
  // const films = await getFilms(data.results);
  return (
    <div className={"prose prose-invert"}>
      {data &&
        data.results.map((p) => (
          <div
            key={p.name}
            className={"border-2 border-white rounded border-solid"}
          >
            <div className={"flex flex-row items-center justify-start p-2"}>
              <h3 className={"m-0 mr-2"}>{p.name}</h3>
              <p className={"m-0"}>({p.gender})</p>
            </div>
          </div>
        ))}
    </div>
  );
}
