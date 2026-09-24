import { useRegionScenery } from '../hooks/useRegionScenery';

/** Keeps `--ss-scenery` in sync globally (landing, auth) without rendering layers. */
export default function RegionScenerySync() {
  useRegionScenery();
  return null;
}
