import type { NextConfig } from "next";

/**
 * ORION ships as a single Python container (see ../Dockerfile): the FastAPI
 * layer serves this front end as pre-built static files, so there is no Node
 * process in production. That requires a fully static export.
 *
 * ORION_UI_BASE_PATH lets the same build be mounted at the site root ("") or
 * alongside the legacy Jinja UI (e.g. "/v2") without touching any links — Next
 * rewrites its own asset URLs and <Link> hrefs from basePath.
 */
const basePath = process.env.ORION_UI_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Fully static: every page is prerendered to plain HTML at build time.
  output: "export",
  trailingSlash: true,
  basePath,
  // With output: 'export', Next stops running its runtime image pipeline. The
  // editorial layout already pre-sizes every image, so leaving optimisation
  // on would just trip a "use a server" warning at build time.
  images: { unoptimized: true },
};

export default nextConfig;
