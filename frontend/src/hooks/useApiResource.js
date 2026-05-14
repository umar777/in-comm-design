import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api.js";

// Generic CRUD slice backed by a REST resource. Returns the items array,
// the raw setter (for ad-hoc local mutation), and create/update/remove
// helpers that hit the API and sync local state from the response.
export function useApiResource(path) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api
      .get(path)
      .then(setItems)
      .catch((err) => console.error(`Failed to load ${path}:`, err));
  }, [path]);

  const create = useCallback(
    async (data) => {
      const created = await api.post(path, data);
      setItems((prev) => [...prev, created]);
      return created;
    },
    [path],
  );

  const update = useCallback(
    async (id, patch) => {
      const updated = await api.patch(`${path}/${id}`, patch);
      setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
      return updated;
    },
    [path],
  );

  const remove = useCallback(
    async (id) => {
      await api.delete(`${path}/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
    },
    [path],
  );

  return { items, setItems, create, update, remove };
}
