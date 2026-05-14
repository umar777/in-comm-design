import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api.js";

// CRUD slice for junction tables with a composite key.
//   path: REST mount point (e.g. "/qualification-units")
//   keys: array of the two PK field names, in the order the backend expects (e.g. ["qualification_id", "unit_id"])
//
// `update` applies the patch optimistically to local state, then fires the
// PATCH in the background. This matters for high-frequency inputs like
// per-keystroke coverage_notes fields — without it, an older API response
// could clobber what the user is currently typing.
export function useApiJunctionResource(path, keys) {
  const [k1, k2] = keys;
  const [items, setItems] = useState([]);

  useEffect(() => {
    api
      .get(path)
      .then(setItems)
      .catch((err) => console.error(`Failed to load ${path}:`, err));
  }, [path]);

  const matches = (row, where) => row[k1] === where[k1] && row[k2] === where[k2];

  const create = useCallback(
    async (data) => {
      const created = await api.post(path, data);
      setItems((prev) => [...prev, created]);
      return created;
    },
    [path],
  );

  const update = useCallback(
    async (where, patch) => {
      setItems((prev) =>
        prev.map((r) => (matches(r, where) ? { ...r, ...patch } : r)),
      );
      try {
        await api.patch(
          `${path}/${encodeURIComponent(where[k1])}/${encodeURIComponent(where[k2])}`,
          patch,
        );
      } catch (err) {
        console.error(`Failed to update ${path}:`, err);
      }
    },
    [path, k1, k2],
  );

  const remove = useCallback(
    async (where) => {
      setItems((prev) => prev.filter((r) => !matches(r, where)));
      try {
        await api.delete(
          `${path}/${encodeURIComponent(where[k1])}/${encodeURIComponent(where[k2])}`,
        );
      } catch (err) {
        console.error(`Failed to delete from ${path}:`, err);
      }
    },
    [path, k1, k2],
  );

  return { items, setItems, create, update, remove };
}
