import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCommandPalette } from "./useCommandPalette";

vi.mock("@vercel/analytics", () => ({ track: vi.fn() }));

const fireKey = (init: KeyboardEventInit) => {
  window.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, cancelable: true, ...init }));
};

describe("useCommandPalette", () => {
  it("starts closed", () => {
    const { result } = renderHook(() => useCommandPalette());
    expect(result.current.open).toBe(false);
  });

  it("opens on Cmd+K and closes again on a second Cmd+K", () => {
    const { result } = renderHook(() => useCommandPalette());

    act(() => fireKey({ key: "k", metaKey: true }));
    expect(result.current.open).toBe(true);

    act(() => fireKey({ key: "k", metaKey: true }));
    expect(result.current.open).toBe(false);
  });

  it("opens on Ctrl+K too", () => {
    const { result } = renderHook(() => useCommandPalette());
    act(() => fireKey({ key: "k", ctrlKey: true }));
    expect(result.current.open).toBe(true);
  });

  it("opens on '/' when nothing is focused", () => {
    const { result } = renderHook(() => useCommandPalette());
    act(() => fireKey({ key: "/" }));
    expect(result.current.open).toBe(true);
  });

  it("does NOT open on '/' while typing in an input", () => {
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();

    const { result } = renderHook(() => useCommandPalette());
    act(() => fireKey({ key: "/" }));
    expect(result.current.open).toBe(false);

    document.body.removeChild(input);
  });

  it("setOpen(false) closes it directly", () => {
    const { result } = renderHook(() => useCommandPalette());
    act(() => fireKey({ key: "k", metaKey: true }));
    expect(result.current.open).toBe(true);

    act(() => result.current.setOpen(false));
    expect(result.current.open).toBe(false);
  });
});
