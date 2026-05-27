import { createLocalCmsData, createLocalCmsUi } from "./local";
import type { CmsDataPort, CmsUiComponents } from "./port";

const HAS_TOKEN = !!process.env.BASEHUB_TOKEN;

type CmsAdapter = {
  ui: CmsUiComponents;
  data: CmsDataPort;
};

let adapter: CmsAdapter | undefined;

const createRemoteData = (): CmsDataPort => ({});

const createRemoteUi = (): CmsUiComponents => ({
  // biome-ignore lint/suspicious/noExplicitAny: Pump is a generic basehub component with
  // complex type inference from query fragments. The adapter's generic Feed type
  // can't express Pump's specific query shapes, so we cast at the adapter boundary.
  Feed: async (props: Record<string, unknown>) => {
    const { Pump } = await import("basehub/react-pump");
    return Pump(props as unknown as Parameters<typeof Pump>[0]);
  },
  Toolbar: () => null,
});

export const getCmsAdapter = (): CmsAdapter => {
  if (adapter) {
    return adapter;
  }

  if (HAS_TOKEN) {
    adapter = {
      ui: createRemoteUi(),
      data: createRemoteData(),
    };
  } else {
    adapter = {
      ui: createLocalCmsUi(),
      data: createLocalCmsData(),
    };
  }

  return adapter;
};
