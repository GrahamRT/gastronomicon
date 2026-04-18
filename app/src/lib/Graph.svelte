<script lang='ts'>
  import type { Ingredient, Pairing } from '$lib/types';
  import { ingredients, pairings } from '$lib/stores';
  import { derived } from 'svelte/store';
  import * as d3 from 'd3';
  const width = 1920;
  const height = 450;
  
  const graph = derived([ingredients, pairings], function ([$ingredients, $pairings]) {
    return {
      nodes: [...$ingredients],
      links: [...$pairings],
    };
  });
  let v: Node;
  console.log(()=> graph);
  const simulation = d3.forceSimulation($graph.nodes)
    .force('link', d3.forceLink($graph.links)
      .id(function (d) {
        return (d as Ingredient).name;
      })
      .links($graph.links))
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width/2, height/2))
      .on('tick', ticked);

  function ticked() {
    d3.selectAll<SVGLineElement, Pairing>('.link')
    .attr('x1', d => (d.source as unknown as Ingredient).x!)
    .attr('y1', d => (d.source as unknown as Ingredient).y!)
    .attr('x2', d => (d.target as unknown as Ingredient).x!)
    .attr('y2', d => (d.target as unknown as Ingredient).y!);
    d3.selectAll<SVGCircleElement, Ingredient>('.node')
      .attr('cx', d => d.x!)
      .attr('cy', d => d.y!);
  }
</script>
<svg id="graph" bind:this={v} width={width} height={height}>
  <g>
    {#each $graph.links as l}
      <line class="link" x1={(l.source as unknown as Ingredient).x} x2={(l.target as unknown as Ingredient).x} y1={(l.source as unknown as Ingredient).y} y2=/{(l.target as unknown as Ingredient).y} />
    {/each}
  </g>
  <g>
    {#each $graph.nodes as n}
      <circle class="node" bind:value={n.x} cy={n.y} r="5"/>
    {/each}
  </g>
</svg>

<style>
  #graph {
    max-width: 100%;
    height: auto;
    .link {
      stroke: #999 1.5 solid;
      opacity: 60%;
    }
    .node {
      stroke: white 1.5 solid;
      fill: rebeccapurple;
    }
  }
</style>
