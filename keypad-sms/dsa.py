"""DSA for offline keypad care: O(1) next-due, O(log n) schedule, O(k) language prefix.

Best case (already due / empty): peek O(1). Worst case insert/ack O(log n).
North-East 2G: never scan a list to find 'what now'.
"""

from __future__ import annotations

import heapq
from collections import deque


class MinHeap:
    """Due-time min-heap. Peek next reminder in O(1); push/pop O(log n)."""

    def __init__(self):
        self._h: list[tuple[int, int, str]] = []
        self._seq = 0

    def push(self, due_min: int, task_id: str) -> None:
        heapq.heappush(self._h, (int(due_min), self._seq, task_id))
        self._seq += 1

    def peek(self) -> tuple[int, str] | None:
        if not self._h:
            return None
        due, _seq, tid = self._h[0]
        return due, tid

    def pop(self) -> tuple[int, str] | None:
        if not self._h:
            return None
        due, _seq, tid = heapq.heappop(self._h)
        return due, tid

    def remove_id(self, task_id: str) -> bool:
        n = len(self._h)
        self._h = [row for row in self._h if row[2] != task_id]
        if len(self._h) == n:
            return False
        heapq.heapify(self._h)
        return True

    def ids_in_order(self) -> list[str]:
        return [tid for _due, _seq, tid in sorted(self._h)]

    def __len__(self) -> int:
        return len(self._h)

    @classmethod
    def from_pairs(cls, pairs: list[tuple[int, str]]) -> "MinHeap":
        heap = cls()
        for due, tid in pairs:
            heap.push(due, tid)
        return heap


class Outbox:
    """FIFO sync queue. Enqueue/dequeue O(1). Drain when the tower comes back."""

    def __init__(self, items: list | None = None):
        self._q: deque = deque(items or [])

    def push(self, item: dict) -> None:
        self._q.append(item)

    def peek(self) -> dict | None:
        return self._q[0] if self._q else None

    def pop(self) -> dict | None:
        return self._q.popleft() if self._q else None

    def __len__(self) -> int:
        return len(self._q)

    def dump(self) -> list:
        return list(self._q)


class PrefixTrie:
    """Phone-series → circle. Lookup O(digits), not O(table)."""

    def __init__(self):
        self._root: dict = {}

    def insert(self, prefix: str, value: str) -> None:
        node = self._root
        for ch in prefix:
            node = node.setdefault(ch, {})
        node["$"] = value

    def longest(self, digits: str) -> str | None:
        node = self._root
        found = None
        for ch in digits:
            if ch not in node:
                break
            node = node[ch]
            if "$" in node:
                found = node["$"]
        return found
