// Sample blog posts for the mock provider, so /blog builds and previews without
// Shopify keys. They never reach the live site: with Shopify connected, posts
// come from Tiffany's Shopify blog. Placeholder copy, written to exercise the
// post styles (headings, lists, a quote, an image, links) and the product tag
// that puts a book under a post.

import ejJerusalemDusk from "@/assets/images/art/ej-jerusalem-dusk.jpg";
import ejTomb from "@/assets/images/art/ej-tomb.jpg";
import holidayFlatlay from "@/assets/images/lifestyle/holiday-flatlay.jpg";
import ncStocking from "@/assets/images/lifestyle/nc-stocking.jpg";
import { fromStatic } from "@/lib/images";
import { HANDLES } from "@/lib/store-config";
import type { Article } from "../types";

const christmasEve = fromStatic(holidayFlatlay, "Nephite Christmas on a table with candles and evergreen");
const stocking = fromStatic(ncStocking, "Nephite Christmas tucked into a Christmas stocking");
const jerusalem = fromStatic(ejJerusalemDusk, "Jerusalem at dusk, an illustration from Easter Journey");
const tomb = fromStatic(ejTomb, "The empty garden tomb, an illustration from Easter Journey");

export const sampleArticles: Article[] = [
  {
    handle: "a-christmas-eve-tradition",
    title: "A Christmas Eve tradition your kids will ask for every year",
    excerpt:
      "Lights low, one book, and the night the Nephites waited for. Here is how our family reads Nephite Christmas on Christmas Eve, and a few ways to make it your own.",
    publishedAt: "2026-10-06T15:00:00Z",
    author: "Tiffany Wheeler",
    tags: [HANDLES.nephiteChristmas, "christmas", "traditions"],
    image: christmasEve,
    seo: { title: "A Christmas Eve Reading Tradition for Families", description: undefined },
    contentHtml: `
<p>Every family has the thing that makes it feel like Christmas Eve. For ours, it is turning off the big lights, gathering everyone on the couch, and reading the story of the night that didn’t get dark.</p>
<h2>Why Christmas Eve works</h2>
<p>The Nephites spent the night before the Savior’s birth watching and waiting for the sign Samuel promised. Reading that story on the same night lets children feel a little of that waiting with them.</p>
<ul>
  <li><strong>Keep it short.</strong> One reading, then bed. Little ones remember the feeling more than the length.</li>
  <li><strong>Let them hunt.</strong> A dove is hidden throughout the book, and finding it keeps young listeners close.</li>
  <li><strong>Add a light.</strong> A single candle (or a flashlight for the very young) makes the “night without darkness” easy to picture.</li>
</ul>
<blockquote><p>We started reading it the year our youngest was two. Now he’s the one who reminds us.</p></blockquote>
<h3>Make it yours</h3>
<p>Some families read it after a Christmas Eve dinner; others read it by the tree after pajamas go on. Pair it with <a href="/freebies">our free printables</a> for an activity the next morning.</p>
<img src="${stocking.url}" alt="${stocking.alt}" width="${stocking.width}" height="${stocking.height}" />
<ol>
  <li>Choose a reader, or take turns by page.</li>
  <li>Pause on the last page and ask what the sign meant to the people who waited.</li>
  <li>Close with a family prayer.</li>
</ol>
<p>However you read it, the point is the same: remembering that Christ came for all of us.</p>`,
  },
  {
    handle: "holy-week-with-kids",
    title: "Holy Week with kids: one short reading a day",
    excerpt:
      "From Palm Sunday to Easter morning, a few minutes each evening is enough to walk through the last week of the Savior’s life together.",
    publishedAt: "2026-03-18T15:00:00Z",
    author: "Tiffany Wheeler",
    tags: [HANDLES.easterJourney, "easter", "traditions"],
    image: jerusalem,
    seo: {},
    contentHtml: `
<p>Easter can arrive in a rush of baskets and egg hunts. Spreading the story across Holy Week gives children time to understand what we celebrate.</p>
<h2>How the eight days work</h2>
<p>At the back of Easter Journey is a reading guide from Palm Sunday to Easter Sunday. Each day, read one part of the story, then talk through a few questions together. Saturday has no reading: it’s a day to remember Christ in the tomb.</p>
<img src="${tomb.url}" alt="${tomb.alt}" width="${tomb.width}" height="${tomb.height}" />
<h3>Tips from families who’ve done it</h3>
<ul>
  <li>Read at the same time each day, like after dinner, so it becomes a habit.</li>
  <li>Let older children read aloud to younger ones.</li>
  <li>Save the last reading for Easter morning, before the baskets.</li>
</ul>`,
  },
];
