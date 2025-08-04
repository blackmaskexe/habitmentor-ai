import api from "./api";
import mmkvStorage from "./mmkvStorage";
import { HabitObject } from "./types";

type TaggedHabit = {
  habitId: string;
  tags: string[];
};

export async function tagHabits() {
  const taggedHabits = await getTaggedHabits();
  const mappedHabitTags = getTaggedHabitsObject(taggedHabits);

  // now, looping through all the habits in mmkvStorage, and assigning a tags property to each of them:
  assignTagToHabits(mappedHabitTags);

  console.log(
    "Done tagging of things I think",
    mmkvStorage.getString("activeHabits")
  );
}

async function getTaggedHabits() {
  try {
    const response = await api.post("/tag-habits", {
      habitData: JSON.parse(mmkvStorage.getString("activeHabits")!),
    });

    const taggedHabits = response.data;
    // validating taggedHabits:
    if (Array.isArray(taggedHabits)) {
      return taggedHabits;
    } else {
      return []; // returning empty array in case AI does not sent back
      // an appropriate response
    }
  } catch (err) {
    console.log(err);
    return []; //return empty array in case of an error
  }
}

function getTaggedHabitsObject(taggedHabits: TaggedHabit[]) {
  return taggedHabits.reduce((acc, taggedHabit) => {
    acc[taggedHabit.habitId] = taggedHabit.tags;
    return acc;
  }, {} as Record<string, string[]>);
}

function assignTagToHabits(mappedHabitTags: Record<string, string[]>) {
  const activeHabits = JSON.parse(
    mmkvStorage.getString("activeHabits") || "[]"
  );
  const taggedActiveHabits = activeHabits.map((habit: HabitObject) => {
    return {
      ...habit,
      tags: mappedHabitTags[habit.id],
    };
  });

  mmkvStorage.set("activeHabits", JSON.stringify(taggedActiveHabits));
}
