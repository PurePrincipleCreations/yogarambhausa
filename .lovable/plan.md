# Course Theater and Himalayan Retreats

## Overview
Build two new premium experiences that extend the current Yogarambha site: a dynamic course theater at `/courses/$slug` and a standalone retreats page at `/retreats`. Reuse the existing course catalog, mock authentication state, brand tokens, Button component, GSAP motion language, and shared navbar.

## Course player
- Add a dynamic route for every catalog course, resolving the course by its existing slug and showing a clear unavailable state for unknown slugs.
- Build a responsive 12-column theater layout with a large rounded 16:9 YouTube stage and a fixed-height, independently scrollable frosted playlist.
- Track the active lesson and completed lessons locally; update the embed and title immediately when a playlist item or Next Lesson is selected.
- Add accessible Mark Complete and Next Lesson controls, progress count/bar, active “Now Playing” indicator, completed states, and mobile-friendly stacking.
- Apply GSAP entrance animation to the stage, sidebar, and staggered lesson rows, with reduced-motion handling.
- Make authenticated catalog CTAs navigate to the matching course player; logged-out CTAs continue to invoke the existing mock sign-in flow.

## Himalayan retreats
- Add `/retreats` with unique SEO/social metadata and connect the existing Retreats navigation item to it.
- Generate and store a cohesive set of Himalayan retreat imagery locally: a wide Naggar/Kullu mountain hero plus movement, nature, and community images for the experience grid.
- Build a full-height image-led hero with bottom readability overlay, centered editorial typography, application CTA, and restrained GSAP image parallax.
- Build the philosophy/experience section as sticky copy beside a staggered masonry image composition with varied scroll speeds.
- Build an alternating vertical itinerary with semantic schedule content, lucide icons, frosted cards, a scroll-drawn center line, and node/card reveals; collapse it cleanly to a single-side mobile timeline.
- Finish with the dark, rounded limited-capacity consultation CTA requested.

## Shared polish and validation
- Replace stale hash navigation with typed TanStack links where routes now exist, while preserving in-page links that still target home-page sections.
- Keep all colors and shadows expressed through existing or newly added semantic design tokens; add only minimal utilities for hidden scrollbars and the equalizer animation.
- Preserve the existing mock-only authentication model; no backend or persistence changes.
- Verify route generation, responsive desktop/mobile layouts, course switching/completion, GSAP behavior, iframe updates, console/runtime state, metadata, and the latest build diagnostics.
- The reported `src/lib/utils.ts(8,7)` error is stale in the current checkout: that file has only six lines and the latest build is clean, so no utility change is planned unless a fresh diagnostic identifies one.
