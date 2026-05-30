<script>

  let {
    text     = "CHO'S STUDIO",
    opacity  = 1,
    fontSize = 13,
    spacing  = 65,
    color    = '#2a2420',
    children,
  } = $props();

  const svgPattern = $derived(() => {
    const w = spacing * 2;
    const h = spacing * 2;
    const cx = w / 2;
    const cy = h / 2;
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">` +
      // main text
      `<text x="${cx}" y="${cy}" dominant-baseline="middle" text-anchor="middle" ` +
      `font-family="HammersmithOne,Georgia,serif" font-size="${fontSize}" ` +
      `fill="${color}" opacity="${opacity}" letter-spacing="2" ` +
      `transform="rotate(-30 ${cx} ${cy})">${text}</text>` +
      // offset repeat
      `<text x="${0}" y="${0}" dominant-baseline="middle" text-anchor="middle" ` +
      `font-family="HammersmithOne,Georgia,serif" font-size="${fontSize}" ` +
      `fill="${color}" opacity="${opacity}" letter-spacing="2" ` +
      `transform="rotate(-30 0 0)">${text}</text>` +
      `</svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  });
</script>

<div class="watermark-wrap">
  {@render children()}
  <div
    class="watermark-overlay"
    aria-hidden="true"
    style="
      background-image: {svgPattern()};
      background-size: {spacing * 2}px {spacing * 2}px;
      background-repeat: repeat;
    "
  ></div>
</div>

<style>
  .watermark-wrap {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .watermark-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 2;
    border-radius: inherit;
  }
</style>
