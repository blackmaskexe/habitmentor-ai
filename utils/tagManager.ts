import api from "./api";
import { getHabitObjectFromId, updateHabit } from "./database/habits";
import mmkvStorage from "./mmkvStorage";
import { HabitObject } from "./types";

type TaggedHabit = {
  habitId: string;
  tags: string[];
};

export async function tagHabits() {
  const habits = JSON.parse(mmkvStorage.getString("activeHabits") || "[]");
  const taggedHabits = await getTaggedHabits(habits);
  const mappedHabitTags = getTaggedHabitsObject(taggedHabits);

  // now, looping through all the habits in mmkvStorage, and assigning a tags property to each of them:
  assignTagToHabits(mappedHabitTags);

  console.log(
    "Done tagging of things I think",
    mmkvStorage.getString("activeHabits")
  );
}

export async function tagOneHabit(habitId: string) {
  try {
    const untaggedHabit: HabitObject = getHabitObjectFromId(habitId)!;
    const taggedHabitArray = await getTaggedHabits([untaggedHabit]); // this is because the function returns an array (in this case
    // the array will be of length 1)
    const taggedHabit: TaggedHabit = taggedHabitArray[0]; // this only contains habitId and tags only, not the entire rest of object, so we create that:
    console.log("Chhapri youtuber, ye le teri new tagged habit typeshi", {
      ...untaggedHabit,
      tags: taggedHabit.tags,
    });
    if (taggedHabit.tags && taggedHabit.tags.length > 0) {
      const updatedHabit = { ...untaggedHabit, tags: taggedHabit.tags };

      updateHabit(habitId, updatedHabit);
    }
  } catch (err) {
    console.log(err, "you wanna be high for this");
  }
}

async function getTaggedHabits(habits: HabitObject[]) {
  try {
    const response = await api.post("/tag-habits", {
      habitData: habits,
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

export function areHabitsTagged() {
  const activeHabits: HabitObject[] = JSON.parse(
    mmkvStorage.getString("activeHabits") || "[]"
  );

  for (const habit of activeHabits) {
    if (!habit.tags || habit.tags.length == 0) {
      return false;
    }
  }
  return true;
}
