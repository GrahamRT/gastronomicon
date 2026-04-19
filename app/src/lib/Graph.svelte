<script lang="ts">
	import type { Ingredient, Pairing } from '$lib/types';
	import { ingredients, pairings } from '$lib/stores';
	import { derived } from 'svelte/store';
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	const width = 1920;
	const height = 1080;

	type GraphNode = Ingredient & d3.SimulationNodeDatum;
	type GraphLink = Omit<Pairing, 'source' | 'target'> & d3.SimulationLinkDatum<GraphNode>;

	let nodes: GraphNode[] = [];
	let links: GraphLink[] = [];
	let simulation: d3.Simulation<GraphNode, GraphLink>;

	// Zoom and Pan variables
	let svgElement: SVGSVGElement;
	let transform = d3.zoomIdentity;

	onMount(() => {
		// Set up zoom behavior
		const zoom = d3
			.zoom<SVGSVGElement, unknown>()
			.scaleExtent([0.1, 8]) // Allows zooming out to 10% and in to 800%
			.on('zoom', (event) => {
				transform = event.transform;
			});

		// Attach zoom to the SVG container
		d3.select(svgElement).call(zoom);

		// Initialize simulation once
		simulation = d3
			.forceSimulation<GraphNode, GraphLink>()
			.force(
				'link',
				d3.forceLink<GraphNode, GraphLink>().id((d) => d.name)
			)
			.force('charge', d3.forceManyBody().strength(-300)) // Increased repulsion for spacing
			.force('center', d3.forceCenter(width / 2, height / 2))
			.on('tick', () => {
				// Re-trigger evaluation for rendering
				nodes = nodes;
				links = links;
			});

		// Manually subscribe to stores so we don't trigger infinite Svelte static reactivity loops
		const unsubscribe = derived([ingredients, pairings], ([$i, $p]) => [$i, $p] as const).subscribe(
			([$i, $p]) => {
				const uniqueNodes = new Map<string, GraphNode>();
				
				// Create new node object references so D3 can mutate them without touching stores
				$i.forEach((d) => uniqueNodes.set(d.name, { ...d }));

				// Fill in missing nodes (like "apples") that D3 needs for connecting links
				$p.forEach((l) => {
					const sourceId = typeof l.source === 'string' ? l.source : (l.source as any).name;
					const targetId = typeof l.target === 'string' ? l.target : (l.target as any).name;

					if (!uniqueNodes.has(sourceId)) {
						uniqueNodes.set(sourceId, { name: sourceId, description: '', volume: '', weight: '' });
					}
					if (!uniqueNodes.has(targetId)) {
						uniqueNodes.set(targetId, { name: targetId, description: '', volume: '', weight: '' });
					}
				});

				// Assign the cleanly aggregated full list of nodes
				nodes = Array.from(uniqueNodes.values());
				links = $p.map((d) => ({ ...d }));

				simulation.nodes(nodes);
				const linkForce = simulation.force<d3.ForceLink<GraphNode, GraphLink>>('link');
				if (linkForce) linkForce.links(links);

				simulation.alpha(1).restart();
			}
		);

		return () => {
			simulation.stop();
			unsubscribe();
		};
	});
</script>

<svg id="graph" bind:this={svgElement} viewBox="0 0 {width} {height}">
	<!-- Apply D3 Zoom Transform to standard SVG coordinate space -->
	<g transform={transform.toString()}>
		<g>
			{#each links as l}
				{#if typeof l.source === 'object' && typeof l.target === 'object'}
					<line
						class="link"
						x1={l.source.x}
						y1={l.source.y}
						x2={l.target.x}
						y2={l.target.y}
					/>
				{/if}
			{/each}
		</g>
		<g>
			{#each nodes as n}
				{#if n.x !== undefined && n.y !== undefined}
					<circle class="node" cx={n.x} cy={n.y} r="8" />
					<text class="node-label" x={n.x} y={n.y - 12}>{n.name}</text>
				{/if}
			{/each}
		</g>
	</g>
	
	<!-- Static Text Overlay that does not zoom -->
	{#if nodes.length === 0}
		<text class="placeholder" x={width / 2} y={height / 2}>Search for an ingredient to begin</text>
	{/if}
</svg>

<style>
	#graph {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: #f9f9f9;
		z-index: -1;
		cursor: grab;
	}
	#graph:active {
		cursor: grabbing;
	}
	.link {
		stroke: #999;
		stroke-width: 1.5;
		opacity: 0.6;
	}
	.node {
		stroke: white;
		stroke-width: 2;
		fill: rebeccapurple;
	}
	.node-label {
		text-anchor: middle;
		font-size: 16px;
		font-family: sans-serif;
		fill: #333;
		pointer-events: none;
	}
	.placeholder {
		text-anchor: middle;
		fill: #888;
		font-family: sans-serif;
		font-size: 20px;
		pointer-events: none;
	}
</style>
