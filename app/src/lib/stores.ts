import { writable, derived } from 'svelte/store';
import { getIngredient, getPairings } from '$lib/util';
export const searchData = writable<string[]>([]);

export const ingredients = derived(searchData, ($searchData, set) => {
  const loadIngredients = async () =>{
    if($searchData.length === 0) {
      set([]);
      return;
    }
    const requests = $searchData.map(getIngredient);
    const results = await Promise.all(requests);
    console.log(results);
    set(results.flat());
  };
  loadIngredients();
});
