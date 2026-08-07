// Part of React Advanced Odontogram - https://github.com/ZoliQua/React-Odontogram-Modul
// Created by Zoltan Dul (https://github.com/ZoliQua) 2025-2026

// Tests for the consolidated settings store + typed `onStateChange` overloads.
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  onStateChange,
  getSettings,
  setWearDetailLevel,
  setDiscolorationDetailLevel,
  setSurfaceNotation,
  setPulpDetailLevel,
  setSecondaryCariesMode,
  setRootCariesMode,
  setRadiographicDepthMode,
  setCariesDepthEnabled,
  setIcdasEnabled,
  setNotesEnabled,
  setReadOnly,
  setNumberingSystem,
  setPerioViewMode,
  setPerioRowVisibility,
  setPerioIndexNameMode,
  setPerioOverlayLayer,
  setCollapsedCard,
  toggleCollapsedCard,
  openPerioOverlay,
  closePerioOverlay,
  getWearDetailLevel,
  getDiscolorationDetailLevel,
  getSurfaceNotation,
  getPulpDetailLevel,
  getSecondaryCariesMode,
  getRootCariesMode,
  getRadiographicDepthMode,
  getCariesDepthEnabled,
  getIcdasEnabled,
  getNotesEnabled,
  getReadOnly,
  getCollapsedCards,
  type UiSettings,
  type PerioRowId,
} from "../odontogram";

// Restore each module-level setting to its default after every test so
// individual tests never leak state into the next one.
const DEFAULTS: UiSettings = {
  numberingSystem: "FDI",
  readOnly: false,
  notesEnabled: false,
  collapsedCards: {},
  icdasEnabled: false,
  pulpDetailLevel: "aae",
  wearDetailLevel: "complex",
  discolorationDetailLevel: "complex",
  surfaceNotation: "full",
  secondaryCariesMode: "standard",
  rootCariesMode: "simple",
  radiographicDepthMode: "off",
  cariesDepthEnabled: true,
  perioViewMode: "toggle",
  perioRowVisibility: {
    plaque: true, bop: true, cal: true, gm: true, pd: true,
    furcation: true, mobility: true, cej: true, rootConcavity: true,
    pi: true, gi: true, mpi: true, mbi: true, kg: true, gt: true, miller: true,
  } as Record<PerioRowId, boolean>,
  perioIndexNameMode: "translated",
};

afterEach(() => {
  // Reset every setting to its default
  setWearDetailLevel(DEFAULTS.wearDetailLevel);
  setDiscolorationDetailLevel(DEFAULTS.discolorationDetailLevel);
  setSurfaceNotation(DEFAULTS.surfaceNotation);
  setPulpDetailLevel(DEFAULTS.pulpDetailLevel);
  setSecondaryCariesMode(DEFAULTS.secondaryCariesMode);
  setRootCariesMode(DEFAULTS.rootCariesMode);
  setRadiographicDepthMode(DEFAULTS.radiographicDepthMode);
  setCariesDepthEnabled(DEFAULTS.cariesDepthEnabled);
  setIcdasEnabled(DEFAULTS.icdasEnabled);
  setNotesEnabled(DEFAULTS.notesEnabled);
  setReadOnly(DEFAULTS.readOnly);
  setNumberingSystem(DEFAULTS.numberingSystem);
  setPerioViewMode(DEFAULTS.perioViewMode);
  setPerioIndexNameMode(DEFAULTS.perioIndexNameMode);
});

// ---------- getSettings() ----------

describe("getSettings()", () => {
  it("returns all default values", () => {
    const s = getSettings();
    expect(s.wearDetailLevel).toBe("complex");
    expect(s.discolorationDetailLevel).toBe("complex");
    expect(s.surfaceNotation).toBe("full");
    expect(s.pulpDetailLevel).toBe("aae");
    expect(s.secondaryCariesMode).toBe("standard");
    expect(s.rootCariesMode).toBe("simple");
    expect(s.radiographicDepthMode).toBe("off");
    expect(s.cariesDepthEnabled).toBe(true);
    expect(s.icdasEnabled).toBe(false);
    expect(s.notesEnabled).toBe(false);
    expect(s.readOnly).toBe(false);
    expect(s.numberingSystem).toBe("FDI");
    expect(s.perioViewMode).toBe("toggle");
    expect(s.perioIndexNameMode).toBe("translated");
    expect(s.collapsedCards).toEqual({});
    for (const key of Object.keys(s.perioRowVisibility) as PerioRowId[]) {
      expect(s.perioRowVisibility[key]).toBe(true);
    }
  });

  it("returns a snapshot that reflects current values after a change", () => {
    setWearDetailLevel("simple");
    expect(getSettings().wearDetailLevel).toBe("simple");
    setDiscolorationDetailLevel("simple");
    expect(getSettings().discolorationDetailLevel).toBe("simple");
    setSurfaceNotation("simple");
    expect(getSettings().surfaceNotation).toBe("simple");
    setPulpDetailLevel("latin");
    expect(getSettings().pulpDetailLevel).toBe("latin");
    setReadOnly(true);
    expect(getSettings().readOnly).toBe(true);
    setPerioViewMode("popup");
    expect(getSettings().perioViewMode).toBe("popup");
    setPerioIndexNameMode("canonical");
    expect(getSettings().perioIndexNameMode).toBe("canonical");
  });

  it("returned object is a copy — mutating it does not affect internal state", () => {
    const s = getSettings();
    (s as Record<string, unknown>).readOnly = true;
    expect(getSettings().readOnly).toBe(false);
  });

  it("collapsedCards reflects setCollapsedCard", () => {
    setCollapsedCard("status", true);
    expect(getSettings().collapsedCards.status).toBe(true);
    toggleCollapsedCard("status");
    expect(getSettings().collapsedCards.status).toBe(false);
  });
});

// ---------- onStateChange("settings", cb) ----------

describe('onStateChange("settings", cb)', () => {
  it("fires when a setting is changed via setWearDetailLevel", () => {
    let fired = 0;
    const unsub = onStateChange("settings", () => { fired++; });
    setWearDetailLevel("simple");
    expect(fired).toBe(1);
    unsub();
  });

  it("fires when a setting is changed via setPulpDetailLevel", () => {
    let fired = 0;
    const unsub = onStateChange("settings", () => { fired++; });
    setPulpDetailLevel("latin");
    expect(fired).toBe(1);
    unsub();
  });

  it("fires when a setting is changed via setSurfaceNotation", () => {
    let fired = 0;
    const unsub = onStateChange("settings", () => { fired++; });
    setSurfaceNotation("simple");
    expect(fired).toBe(1);
    unsub();
  });

  it("fires when a setting is changed via setReadOnly", () => {
    let fired = 0;
    const unsub = onStateChange("settings", () => { fired++; });
    setReadOnly(true);
    expect(fired).toBe(1);
    unsub();
  });

  it("fires when a setting is changed via setNotesEnabled", () => {
    let fired = 0;
    const unsub = onStateChange("settings", () => { fired++; });
    setNotesEnabled(true);
    expect(fired).toBe(1);
    unsub();
  });

  it("fires when a setting is changed via setNumberingSystem", () => {
    let fired = 0;
    const unsub = onStateChange("settings", () => { fired++; });
    setNumberingSystem("UNIVERSAL");
    expect(fired).toBe(1);
    unsub();
  });

  it("fires when a setting is changed via setPerioViewMode", () => {
    let fired = 0;
    const unsub = onStateChange("settings", () => { fired++; });
    setPerioViewMode("popup");
    expect(fired).toBe(1);
    unsub();
  });

  it("fires when a perio-row visibility changes", () => {
    let fired = 0;
    const unsub = onStateChange("settings", () => { fired++; });
    setPerioRowVisibility("pd", false);
    expect(fired).toBe(1);
    unsub();
  });

  it("fires when a perio index-name mode changes", () => {
    let fired = 0;
    const unsub = onStateChange("settings", () => { fired++; });
    setPerioIndexNameMode("canonical");
    expect(fired).toBe(1);
    unsub();
  });

  it("fires when the perio overlay layer changes", () => {
    let fired = 0;
    const unsub = onStateChange("settings", () => { fired++; });
    setPerioOverlayLayer("bop");
    expect(fired).toBe(1);
    unsub();
  });

  it("fires on openPerioOverlay", () => {
    let fired = 0;
    const unsub = onStateChange("settings", () => { fired++; });
    openPerioOverlay();
    expect(fired).toBe(1);
    unsub();
    closePerioOverlay();
  });

  it("fires on closePerioOverlay", () => {
    let fired = 0;
    const unsub = onStateChange("settings", () => { fired++; });
    closePerioOverlay();
    expect(fired).toBe(1);
    unsub();
  });

  it("unsubscribe stops firing", () => {
    let fired = 0;
    const unsub = onStateChange("settings", () => { fired++; });
    setWearDetailLevel("simple");
    expect(fired).toBe(1);
    unsub();
    setWearDetailLevel("complex");
    expect(fired).toBe(1); // still 1 — unsubscribed
  });

  it("does NOT fire for an unchanged setting (idempotent)", () => {
    let fired = 0;
    const unsub = onStateChange("settings", () => { fired++; });
    setWearDetailLevel("complex"); // already complex
    expect(fired).toBe(0);
    unsub();
  });

  it("multiple listeners each fire", () => {
    let a = 0, b = 0;
    const u1 = onStateChange("settings", () => { a++; });
    const u2 = onStateChange("settings", () => { b++; });
    setPulpDetailLevel("simple");
    expect(a).toBe(1);
    expect(b).toBe(1);
    u1(); u2();
  });
});

// ---------- onStateChange(cb) fires on everything (backward compat) ----------

describe('onStateChange(cb) — no filter (legacy)', () => {
  it("fires on a settings change", () => {
    let fired = 0;
    const unsub = onStateChange(() => { fired++; });
    setWearDetailLevel("simple");
    expect(fired).toBe(1);
    unsub();
  });

  it("fires on a perio overlay change", () => {
    let fired = 0;
    const unsub = onStateChange(() => { fired++; });
    setPerioOverlayLayer("bop");
    expect(fired).toBe(1);
    unsub();
  });
});
