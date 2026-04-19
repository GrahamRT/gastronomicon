<script lang="ts">
	import type { Ingredient, Pairing } from '$lib/types';
	import { Plus } from 'lucide-svelte';
	import { get } from 'svelte/store';
	import { ingredients, pairings } from '$lib/stores';
	import { getIngredient, getPairings } from '$lib/util';

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const ingredient = formData.get('ingredient-search') as string;
		if (!ingredient) return;

		getIngredient(ingredient).then((res: any) => {
			// The backend occasionally returns an array of ingredients (e.g. from a Postgres row response)
			// We need to extract the first standard element.
			const item = Array.isArray(res) ? res[0] : res;
			if (!item) return;

			ingredients.update((ing) => {
				// We must logically deep-check by name to prevent multiple nodes stacking up, 
				// as the `new Set()` trick only prevents exact duplicate object references in JS!
				if (ing.some((x) => x.name === item.name)) return ing;
				return [...ing, item];
			});
		});

		getPairings(ingredient).then((p: Pairing[]) => {
			pairings.update((pair) => {
				const newPairs = (p || []).filter((newP) => {
					// We must check if the links array already possesses this edge!
					// An undirected graph means A->B is identical to B->A.
					return !pair.some((oldP) => {
            // Unpack D3's potential object references to match strictly against strings 
            const oldSource = typeof oldP.source === 'string' ? oldP.source : oldP.source.name;
            const oldTarget = typeof oldP.target === 'string' ? oldP.target : oldP.target.name;
            
            return (oldSource === newP.source && oldTarget === newP.target) || 
                   (oldSource === newP.target && oldTarget === newP.source);
          });
				});
				return [...pair, ...newPairs];
			});
		});

		(e.target as HTMLFormElement).reset();
	}
</script>

<search>
	<form on:submit={handleSubmit} method="get">
		<input
			type="search"
			name="ingredient-search"
			id="ingredient-search"
			placeholder="Add ingredients..."
		/>
		<button id="ingredient-submit" type="submit"><Plus color="#bbb" size={36} /></button>
	</form>
</search>

<style>
	/* SearchBar element */
	search form {
		padding: 1.5em;
		display: flex;
		gap: 5px;
		justify-content: center;
	}

	#ingredient-search {
		width: 30rem;
		padding: 1em;
		border: none;
		border-radius: 10rem;
		filter: var(--element-shadow);
	}
	#ingredient-search::placeholder {
		color: #aaa;
	}

	#ingredient-submit {
		padding: 0.5em 0.7em;
		background-color: white;
		border-radius: 3em;
		filter: var(--element-shadow);
	}
</style>
