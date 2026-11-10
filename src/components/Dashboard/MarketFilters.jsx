*** Add File: src/components/Dashboard/MarketFilters.jsx
+import React from "react";
+import { useWatchlist } from "../context/WatchlistContextDefinition";
+
+/**
+ * Simple button component used in market listings to add or remove a coin
+ * from the user's watchlist.
+ *
+ * @param {{coin: {id: string, name: string}}} props
+ */
+const MarketFilters = ({ coin }) => {
+  const { watchlist, toggleWatchlist } = useWatchlist();
+  const inWatchlist = watchlist.includes(coin.id);
+
+  return (
+    <button onClick={() => toggleWatchlist(coin.id)}>
+      {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
+    </button>
+  );
+};
+
+export default MarketFilters;
+
*** End Patch
